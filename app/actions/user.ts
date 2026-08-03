"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateProfile(state: any, formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { error: "No autorizado" };

    await dbConnect();

    const targetUserId = (session.role === "admin" && formData.get("targetUserId")) 
      ? formData.get("targetUserId")?.toString() 
      : session.userId;

    const name = formData.get("name")?.toString().trim();
    const lastName = formData.get("lastName")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();

    if (!name || !email) {
      return { error: "Nombre y correo son obligatorios." };
    }

    const updateData: any = { name, lastName, email };

    if (password) {
      if (password.length < 6) return { error: "La contraseña es muy corta" };
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Prevención colisión correo
    const existing = await User.findOne({ email });
    if (existing && existing._id.toString() !== targetUserId) {
      return { error: "El correo ya está en uso por otra persona." };
    }

    await User.findByIdAndUpdate(targetUserId, updateData);
    
    if (session.role === "admin") {
      revalidatePath("/admin/users");
    } else {
      revalidatePath("/perfil");
    }

    return { success: "Perfil actualizado correctamente." };
  } catch (err: any) {
    return { error: "Error al actualizar perfil." };
  }
}

// ---------------- Admin Actions ----------------

export async function deleteUser(userId: string) {
  const session = await getSession();
  if (session?.role !== "admin") return { error: "No autorizado" };

  await dbConnect();
  await User.findByIdAndDelete(userId);
  revalidatePath("/admin/users");
  return { success: "Usuario eliminado" };
}

export async function updateUserAdmin(userId: string, formData: FormData) {
  const session = await getSession();
  if (session?.role !== "admin") return { error: "No autorizado" };

  await dbConnect();
  
  const name = formData.get("name")?.toString().trim();
  const lastName = formData.get("lastName")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const role = formData.get("role")?.toString().trim();
  const password = formData.get("password")?.toString().trim();

  const updateData: any = { name, lastName, email, role };

  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(password, salt);
  }

  await User.findByIdAndUpdate(userId, updateData);
  revalidatePath("/admin/users");
  
  return { success: "Usuario modificado" };
}

export async function createUserByAdmin(formData: FormData) {
  const session = await getSession();
  if (session?.role !== "admin") return { error: "No autorizado" };

  await dbConnect();

  const name = formData.get("name")?.toString().trim();
  const lastName = formData.get("lastName")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString().trim();
  const role = formData.get("role")?.toString().trim() || "user";

  if (!name || !email || !password) {
    return { error: "Todos los campos son obligatorios" };
  }

  const existing = await User.findOne({ email });
  if (existing) return { error: "El correo ya está registrado" };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await User.create({
    name,
    lastName,
    email,
    password: hashedPassword,
    role
  });

  revalidatePath("/admin/users");
  return { success: "Usuario creado correctamente" };
}
