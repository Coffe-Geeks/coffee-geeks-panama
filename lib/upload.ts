import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

export async function saveUploadedFile(file: File, subfolder = ""): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = path.join(process.cwd(), "uploads", subfolder);
  await mkdir(uploadDir, { recursive: true });
  
  // Extension handling
  let ext = "webp";
  if (file.name.includes(".")) {
    ext = file.name.split(".").pop() || "webp";
  } else if (file.type) {
    ext = file.type.split("/").pop() || "webp";
  }
  
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  
  return subfolder ? `/api/uploads/${subfolder}/${filename}` : `/api/uploads/${filename}`;
}

export async function deleteUploadedFile(fileUrl: string): Promise<boolean> {
  try {
    // The url looks like /api/uploads/subfolder/filename or /api/uploads/filename
    if (!fileUrl.startsWith('/api/uploads/')) return false;
    
    const relativePath = fileUrl.replace('/api/uploads/', '');
    // Prevenir path traversal
    if (relativePath.includes('..')) return false;

    const filepath = path.join(process.cwd(), "uploads", relativePath);
    await unlink(filepath);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}
