"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { getPasswordResetEmailTemplate } from "@/lib/email-templates";

// El enlace vive una hora: suficiente para leer el correo, poco para que
// un token olvidado en una bandeja siga sirviendo semanas después.
const TOKEN_TTL_MS = 60 * 60 * 1000;

// Un solo tipo para el estado del formulario: sin esto TypeScript infiere
// una unión y no deja leer .error donde puede venir .success
type ActionState = { error?: string; success?: string };

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Pide el enlace de recuperación.
 *
 * Responde siempre lo mismo exista o no la cuenta: si el mensaje
 * cambiara, cualquiera podría usar este formulario para averiguar qué
 * correos están registrados.
 */
export async function requestPasswordReset(
  _state: any,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email")?.toString().trim().toLowerCase() || "";

  const genericSuccess: ActionState = {
    success:
      "Si ese correo está registrado, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja y la carpeta de spam.",
  };

  if (!email || !email.includes("@")) {
    return { error: "Escribe un correo electrónico válido." };
  }

  try {
    await dbConnect();
    const user = await User.findOne({ email });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      user.set("resetTokenHash", hashToken(token));
      user.set("resetTokenExpiry", new Date(Date.now() + TOKEN_TTL_MS));
      await user.save();

      const url = `${await getBaseUrl()}/recuperar/${token}`;
      await sendEmail({
        to: user.email,
        subject: "Restablece tu contraseña · Coffee Geeks Panamá",
        html: getPasswordResetEmailTemplate(user.name || "", url),
      });
    }

    return genericSuccess;
  } catch (error) {
    console.error("Error al solicitar recuperación:", error);
    return { error: "No pudimos procesar la solicitud. Intenta de nuevo." };
  }
}

/** Comprueba que el enlace siga siendo válido antes de mostrar el formulario. */
export async function isResetTokenValid(token: string) {
  if (!token) return false;
  await dbConnect();
  const user = await User.findOne({
    resetTokenHash: hashToken(token),
    resetTokenExpiry: { $gt: new Date() },
  }).select("_id");
  return !!user;
}

/** Fija la nueva contraseña y quema el token para que no sirva dos veces. */
export async function resetPassword(
  _state: any,
  formData: FormData
): Promise<ActionState> {
  const token = formData.get("token")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const confirm = formData.get("confirmPassword")?.toString() || "";

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }
  if (password !== confirm) {
    return { error: "Las contraseñas no coinciden." };
  }

  try {
    await dbConnect();
    const user = await User.findOne({
      resetTokenHash: hashToken(token),
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return {
        error:
          "Este enlace ya no es válido. Puede haber expirado o haberse usado. Solicita uno nuevo.",
      };
    }

    const salt = await bcrypt.genSalt(10);
    user.set("password", await bcrypt.hash(password, salt));
    user.set("resetTokenHash", null);
    user.set("resetTokenExpiry", null);
    await user.save();

    return { success: "Tu contraseña se actualizó. Ya puedes iniciar sesión." };
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    return { error: "No pudimos actualizar la contraseña. Intenta de nuevo." };
  }
}
