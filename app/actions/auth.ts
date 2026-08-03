"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/email";
import { getWelcomeEmailTemplate, getAdminNotificationEmailTemplate } from "@/lib/email-templates";

// Utility para sanitizar inputs rápidos contra inyecciones absurdas
function sanitizeString(input: any) {
  if (typeof input !== "string") {
    return "";
  }
  return input.trim();
}

async function verifyRecaptcha(token: string) {
  if (!token) return false;
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: "POST" }
    );
    const data = await response.json();
    return data.success && data.score >= 0.5; // Score threshold for v3
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

export async function login(state: any, formData: FormData) {
  await dbConnect();

  const email = sanitizeString(formData.get("email"));
  const password = sanitizeString(formData.get("password"));
  const isAjax = formData.get("ajax") === "true";

  if (!email || !password) {
    return { error: "Todos los campos son obligatorios." };
  }

  // Prevención de inyección NoSQL forzando strings concretos:
  const user = await User.findOne({ email: String(email) });

  if (!user) {
    return { error: "Credenciales inválidas." };
  }

  // Verificación del hash de bcrypt a prueba de ataques (timing safe por defecto)
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Credenciales inválidas." };
  }

  // Creamos la sesión y guardamos en cookie
  await createSession(user._id.toString(), user.role);

  if (isAjax) {
    return { success: true, userRole: user.role };
  }

  if (user.role === "admin") {
    redirect("/admin/dashboard");
  } else {
    redirect("/perfil");
  }
}

export async function register(state: any, formData: FormData) {
  await dbConnect();

  const name = sanitizeString(formData.get("name"));
  const lastName = sanitizeString(formData.get("lastName"));
  const email = sanitizeString(formData.get("email"));
  const password = sanitizeString(formData.get("password"));
  const selectedRole = formData.get("role")?.toString(); // user or cafeteria
  const isAjax = formData.get("ajax") === "true";

  if (!name || !email || !password) {
    return { error: "Nombre, email y contraseña son obligatorios." };
  }

  const recaptchaToken = formData.get("recaptchaToken")?.toString();
  if (process.env.RECAPTCHA_SECRET_KEY && !(await verifyRecaptcha(recaptchaToken || ""))) {
    return { error: "Fallo en la verificación de seguridad (reCAPTCHA)." };
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const existingUser = await User.findOne({ email: String(email) });
  if (existingUser) {
    return { error: "Este correo electrónico ya está registrado." };
  }

  // Hashing bcrypt 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Si no hay usuarios en la base de datos, el primero será admin por defecto 
  const userCount = await User.countDocuments();
  
  let role = "user";
  if (userCount === 0) {
     role = "admin";
  } else {
     if (selectedRole === "cafeteria" || selectedRole === "user") {
        role = selectedRole;
     } else if (["admin", "juez_local", "juez_internacional"].includes(selectedRole || "")) {
        const { getSession } = await import("@/lib/session");
        const session = await getSession();
        if (session && session.role === "admin") {
           role = selectedRole!;
        }
     }
  }

  const newUser = await User.create({
    name,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  // Enviamos correo de bienvenida
  try {
    await sendEmail({
      to: newUser.email,
      subject: "¡Bienvenido a Coffee Geeks!",
      html: getWelcomeEmailTemplate(newUser.name),
    });
  } catch (emailError) {
    console.error("Error sending registration email:", emailError);
    // No bloqueamos el registro si falla el correo
  }

  // Notificamos al administrador
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `Nuevo Registro: ${newUser.name} ${newUser.lastName || ""}`,
        html: getAdminNotificationEmailTemplate({
          name: newUser.name,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
        }),
      });
    }
  } catch (adminEmailError) {
    console.error("Error sending admin notification email:", adminEmailError);
  }

  // Logeamos al usuario tras su registro
  await createSession(newUser._id.toString(), newUser.role);

  if (isAjax) {
    return { success: true, userRole: newUser.role };
  }

  if (role === "admin") {
    redirect("/admin/dashboard");
  } else {
    redirect("/perfil");
  }
}

export async function registerCafeteria(state: any, formData: FormData) {
  await dbConnect();

  const name = sanitizeString(formData.get("name"));
  const lastName = sanitizeString(formData.get("lastName"));
  const email = sanitizeString(formData.get("email"));
  const password = sanitizeString(formData.get("password"));

  if (!name || !email || !password) {
    return { error: "Nombre, email y contraseña son obligatorios." };
  }

  const recaptchaToken = formData.get("recaptchaToken")?.toString();
  if (process.env.RECAPTCHA_SECRET_KEY && !(await verifyRecaptcha(recaptchaToken || ""))) {
    return { error: "Fallo en la verificación de seguridad (reCAPTCHA)." };
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const existingUser = await User.findOne({ email: String(email) });
  if (existingUser) {
    return { error: "Este correo electrónico ya está registrado." };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Si no hay usuarios aún, el primero siempre será admin
  const userCount = await User.countDocuments();
  const role = userCount === 0 ? "admin" : "cafeteria";

  const newUser = await User.create({
    name,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  // Enviamos correo de bienvenida
  try {
    await sendEmail({
      to: newUser.email,
      subject: "¡Bienvenido a Coffee Geeks!",
      html: getWelcomeEmailTemplate(newUser.name),
    });
  } catch (emailError) {
    console.error("Error sending registration email (cafeteria):", emailError);
  }

  // Notificamos al administrador
  try {
      const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `Nuevo Registro (Participante): ${newUser.name} ${newUser.lastName || ""}`,
        html: getAdminNotificationEmailTemplate({
          name: newUser.name,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
        }),
      });
    }
  } catch (adminEmailError) {
    console.error("Error sending admin notification email (cafeteria):", adminEmailError);
  }

  await createSession(newUser._id.toString(), newUser.role);

  redirect("/perfil");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
