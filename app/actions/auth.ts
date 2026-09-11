"use server";

import dbConnect from "@/lib/mongodb";
import User, { type UserRole, isUserRole } from "@/models/User";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/email";
import { getWelcomeEmailTemplate, getAdminNotificationEmailTemplate } from "@/lib/email-templates";
import { agregarContactoBrevo } from "@/lib/brevo";

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
  
  /**
   * El rol NO se toma del formulario salvo que lo pida un administrador.
   *
   * Hasta el 11 de septiembre de 2026 bastaba con enviar `role=cafeteria`
   * en el registro para quedar inscrito como participante del concurso —y,
   * por tanto, votable—. Así entraron once personas que no son
   * establecimientos.
   *
   * Ser participante exige firmar un contrato, así que ese rol lo otorga un
   * administrador desde /admin/users después de la firma. Quien se registre
   * por su cuenta queda como usuario general, que es lo que necesita para
   * comprar y votar.
   */
  let role: UserRole = "user";

  if (userCount === 0) {
    // La primera cuenta de una instalación vacía es la del administrador
    role = "admin";
  } else if (selectedRole && selectedRole !== "user") {
    const { getSession } = await import("@/lib/session");
    const session = await getSession();
    if (session && session.role === "admin" && isUserRole(selectedRole)) {
      role = selectedRole;
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

  /**
   * Quien se inscribe por /register-participantes queda con rol `cafeteria`
   * pero INACTIVO por defecto (`isActive: false`).
   *
   * Esto requiere que el administrador lo active manualmente desde
   * /admin/users (haciendo clic en el botón de estado) una vez revisada
   * su solicitud y firmado el acuerdo de participación.
   * Mientras esté inactivo, no aparecerá en la votación pública ni en la lista.
   */
  const userCount = await User.countDocuments();
  const role = userCount === 0 ? "admin" : "cafeteria";

  const newUser = await User.create({
    name,
    lastName,
    email,
    password: hashedPassword,
    role,
    isActive: false, // Inactivo por defecto: requiere activación manual por el admin
  });

  // El participante queda también en la lista de Brevo
  await agregarContactoBrevo(newUser.email, "BREVO_LISTA_PARTICIPANTES", {
    CONTACTO: [name, lastName].filter(Boolean).join(" "),
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
        subject: `Solicitud de participación: ${newUser.name} ${newUser.lastName || ""}`,
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
