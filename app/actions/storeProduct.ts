"use server";

import dbConnect from "@/lib/mongodb";
import StoreProduct from "@/models/StoreProduct";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { saveUploadedFile } from "@/lib/upload";

async function checkAdminAuth() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("No autorizado.");
  }
  return true;
}

export async function getStoreProducts(onlyActive = false) {
  try {
    await dbConnect();
    const query = onlyActive ? { isActive: true } : {};
    const products = await StoreProduct.find(query).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error("Error al obtener productos de la tienda:", err);
    return [];
  }
}

export async function getStoreProductById(id: string) {
  try {
    await dbConnect();
    const product = await StoreProduct.findById(id).lean();
    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch (err) {
    console.error("Error al obtener producto por ID:", err);
    return null;
  }
}

export async function saveStoreProduct(formData: FormData) {
  try {
    await checkAdminAuth();
    await dbConnect();

    const id = formData.get("id")?.toString();
    const name = formData.get("name")?.toString() || "";
    const priceStr = formData.get("price")?.toString() || "0";
    const shortDescription = formData.get("shortDescription")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const webhook = formData.get("webhook")?.toString() || "";
    const isActive = formData.get("isActive") === "true";

    if (!name) return { error: "El nombre es obligatorio." };

    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) return { error: "El precio debe ser un número válido mayor o igual a 0." };

    const updateData: any = {
      name,
      price,
      shortDescription,
      description,
      webhook,
      isActive,
    };

    const mainImageFile = formData.get("mainImage") as File | null;
    if (mainImageFile && mainImageFile.size > 0) {
      updateData.image = await saveUploadedFile(mainImageFile, "products");
    }

    if (id) {
      await StoreProduct.findByIdAndUpdate(id, updateData);
    } else {
      await StoreProduct.create(updateData);
    }

    revalidatePath("/admin/productos");
    revalidatePath("/tienda");
    if (id) {
      revalidatePath(`/tienda/${id}`);
    }

    return { success: "Producto guardado correctamente." };
  } catch (err: any) {
    console.error(err);
    return { error: err.message || "Error al guardar el producto." };
  }
}

export async function deleteStoreProduct(id: string) {
  try {
    await checkAdminAuth();
    await dbConnect();
    await StoreProduct.findByIdAndDelete(id);

    revalidatePath("/admin/productos");
    revalidatePath("/tienda");
    revalidatePath(`/tienda/${id}`);

    return { success: "Producto eliminado correctamente." };
  } catch (err: any) {
    console.error(err);
    return { error: err.message || "Error al eliminar el producto." };
  }
}

export async function uploadStoreProductImage(formData: FormData) {
  try {
    await checkAdminAuth();

    const file = formData.get("image") as File;
    if (!file) return { error: "No se proporcionó ninguna imagen." };

    const url = await saveUploadedFile(file, "product-content");
    return { url };
  } catch (err: any) {
    console.error(err);
    return { error: err.message || "Error al subir la imagen." };
  }
}
