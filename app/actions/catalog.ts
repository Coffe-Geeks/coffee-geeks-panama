"use server";

import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

async function isAllowed(targetCafeteriaId: string) {
  const session = await getSession();
  if (!session) return false;
  if (session.role === "admin") return true;
  if (session.userId === targetCafeteriaId && session.role === "cafeteria") return true;
  return false;
}

export async function getCategories(cafeteriaId: string) {
  await dbConnect();
  const categories = await Category.find({ cafeteriaId }).lean();
  return JSON.parse(JSON.stringify(categories));
}

export async function getProducts(cafeteriaId: string) {
  await dbConnect();
  const products = await Product.find({ cafeteriaId }).lean();
  return JSON.parse(JSON.stringify(products));
}

export async function createCategory(cafeteriaId: string, formData: FormData) {
  if (!(await isAllowed(cafeteriaId))) return { error: "No autorizado" };
  const name = formData.get("name")?.toString().trim();
  if (!name) return { error: "El nombre es obligatorio" };

  await dbConnect();
  await Category.create({ name, cafeteriaId });
  revalidatePath("/perfil/menu");
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteCategory(cafeteriaId: string, categoryId: string) {
  if (!(await isAllowed(cafeteriaId))) return { error: "No autorizado" };
  await dbConnect();
  // Alerta: Si borramos categoría, qué pasa con sus productos? Los borramos también.
  await Product.deleteMany({ categoryId, cafeteriaId });
  await Category.findOneAndDelete({ _id: categoryId, cafeteriaId });
  revalidatePath("/perfil/menu");
  revalidatePath("/admin/users");
  return { success: true };
}

export async function createProduct(cafeteriaId: string, formData: FormData) {
  if (!(await isAllowed(cafeteriaId))) return { error: "No autorizado" };
  
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || "";
  const categoryId = formData.get("categoryId")?.toString().trim();
  const file = formData.get("image") as File;

  if (!name || !categoryId) return { error: "Nombre y categoría son obligatorios." };

  await dbConnect();
  
  let imageUrl = "";
  if (file && file.size > 0) {
     const ext = path.extname(file.name);
     const fileName = `${randomUUID()}${ext}`;
     const dirPath = path.join(process.cwd(), "public", "uploads");
     const filePath = path.join(dirPath, fileName);
     
     const buffer = Buffer.from(await file.arrayBuffer());
     await fs.writeFile(filePath, buffer);
     imageUrl = `/uploads/${fileName}`;
  }

  await Product.create({
    name,
    description,
    categoryId,
    cafeteriaId,
    image: imageUrl,
  });

  revalidatePath("/perfil/menu");
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteProduct(cafeteriaId: string, productId: string) {
   if (!(await isAllowed(cafeteriaId))) return { error: "No autorizado" };
   await dbConnect();
   await Product.findOneAndDelete({ _id: productId, cafeteriaId });
   revalidatePath("/perfil/menu");
   revalidatePath("/admin/users");
   return { success: true };
}
