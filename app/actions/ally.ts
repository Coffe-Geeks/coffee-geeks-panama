"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Ally from "@/models/Ally";
import { saveUploadedLogo, deleteUploadedFile } from "@/lib/upload";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("No autorizado");
}

function revalidateAll() {
  revalidatePath("/admin/aliados");
  revalidatePath("/home");
  revalidatePath("/");
}

// ── Lectura pública ──

export async function getAllies({ onlyActive = true } = {}) {
  await dbConnect();
  const query = onlyActive ? { isActive: true } : {};
  const allies = await Ally.find(query).sort({ order: 1, name: 1 }).lean();
  return JSON.parse(JSON.stringify(allies));
}

export async function getAllyById(id: string) {
  await dbConnect();
  const ally = await Ally.findById(id).lean();
  return JSON.parse(JSON.stringify(ally));
}

// ── Escritura (solo admin) ──

export async function createAlly(formData: FormData) {
  await requireAdmin();
  await dbConnect();

  const logoFile = formData.get("logo") as File;
  let logo = "";
  if (logoFile && logoFile.size > 0) {
    logo = await saveUploadedLogo(logoFile, "aliados");
  }

  const ally = await Ally.create({
    name: formData.get("name")?.toString().trim(),
    url: formData.get("url")?.toString().trim() || "",
    logo,
    isLightLogo: formData.get("isLightLogo") === "true",
    isActive: formData.get("isActive") === "true",
    order: Number(formData.get("order")) || 0,
  });

  revalidateAll();
  return JSON.parse(JSON.stringify(ally));
}

export async function updateAlly(id: string, formData: FormData) {
  await requireAdmin();
  await dbConnect();

  const updateData: any = {
    name: formData.get("name")?.toString().trim(),
    url: formData.get("url")?.toString().trim() || "",
    isLightLogo: formData.get("isLightLogo") === "true",
    isActive: formData.get("isActive") === "true",
    order: Number(formData.get("order")) || 0,
  };

  const logoFile = formData.get("logo") as File;
  if (logoFile && logoFile.size > 0) {
    updateData.logo = await saveUploadedLogo(logoFile, "aliados");
  }

  await Ally.findByIdAndUpdate(id, updateData);
  revalidateAll();
}

export async function deleteAlly(id: string) {
  await requireAdmin();
  await dbConnect();

  const ally = await Ally.findById(id);
  if (ally) {
    if (ally.logo) await deleteUploadedFile(ally.logo);
    await Ally.findByIdAndDelete(id);
  }

  revalidateAll();
}
