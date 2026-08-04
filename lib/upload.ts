import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

/**
 * Guarda archivos en dos destinos según dónde corra la app:
 *
 * - **Vercel** (testing): su sistema de archivos es de solo lectura, así que
 *   escribir en disco lanza EROFS. Se usa Vercel Blob, detectado por la
 *   presencia de BLOB_READ_WRITE_TOKEN.
 * - **Droplet** (producción): disco persistente en ./uploads, servido por
 *   app/api/uploads/[...path]. Sigue funcionando exactamente igual que antes.
 *
 * Las URLs devueltas se distinguen solas: las de Blob son absolutas
 * (https://…blob.vercel-storage.com/…) y las de disco relativas
 * (/api/uploads/…), así que ambas conviven en la base sin migrar nada.
 */
const useBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;

function buildFilename(file: File) {
  let ext = "webp";
  if (file.name.includes(".")) {
    ext = file.name.split(".").pop() || "webp";
  } else if (file.type) {
    ext = file.type.split("/").pop() || "webp";
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
}

export async function saveUploadedFile(file: File, subfolder = ""): Promise<string> {
  const filename = buildFilename(file);

  if (useBlob()) {
    const { put } = await import("@vercel/blob");
    const key = subfolder ? `${subfolder}/${filename}` : filename;
    const { url } = await put(key, file, {
      access: "public",
      // El nombre ya lleva timestamp y sufijo aleatorio; no hace falta
      // que Blob añada el suyo y ensucie la URL.
      addRandomSuffix: false,
    });
    return url;
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = path.join(process.cwd(), "uploads", subfolder);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return subfolder ? `/api/uploads/${subfolder}/${filename}` : `/api/uploads/${filename}`;
}

export async function deleteUploadedFile(fileUrl: string): Promise<boolean> {
  try {
    if (!fileUrl) return false;

    // Archivo en Blob: la URL es absoluta
    if (fileUrl.startsWith("http")) {
      if (!useBlob()) return false;
      const { del } = await import("@vercel/blob");
      await del(fileUrl);
      return true;
    }

    // Archivo en disco
    if (!fileUrl.startsWith("/api/uploads/")) return false;

    const relativePath = fileUrl.replace("/api/uploads/", "");
    // Prevenir path traversal
    if (relativePath.includes("..")) return false;

    await unlink(path.join(process.cwd(), "uploads", relativePath));
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}
