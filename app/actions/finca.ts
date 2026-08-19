"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Finca from "@/models/Finca";
import { isFincaRegion, type FincaRegion } from "@/lib/finca-constants";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/upload";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") throw new Error("No autorizado");
}

// Rechaza regiones fuera del enum antes de llegar a Mongoose, que lanzaría
function parseRegion(value: FormDataEntryValue | null): FincaRegion {
  const region = value?.toString() || "";
  return isFincaRegion(region) ? region : "Boquete";
}

function parseList(value: FormDataEntryValue | null): string[] {
  return (value?.toString() || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

// ── Lectura pública ──

export async function getFincas({ onlyActive = true } = {}) {
  await dbConnect();
  const query = onlyActive ? { isActive: true } : {};
  const fincas = await Finca.find(query).sort({ order: 1, name: 1 }).lean();
  return JSON.parse(JSON.stringify(fincas));
}

export async function getFincaById(id: string) {
  await dbConnect();
  const finca = await Finca.findById(id).lean();
  return JSON.parse(JSON.stringify(finca));
}

/**
 * La URL llega como slug-id (ej. "hacienda-la-esmeralda-60d5ec..."),
 * mismo esquema que /participantes. El ObjectId es el último segmento.
 */
export async function getFincaBySlugId(slugId: string) {
  const parts = slugId.split("-");
  const objectId = parts[parts.length - 1];
  if (!/^[a-f\d]{24}$/i.test(objectId)) return null;

  await dbConnect();
  const finca = await Finca.findById(objectId).lean();
  return finca ? JSON.parse(JSON.stringify(finca)) : null;
}

/**
 * Aplana las experiencias activas de todas las fincas activas para la
 * página "Del Origen a la Barra", conservando de qué finca viene cada una.
 */
export async function getExperiences() {
  await dbConnect();
  const fincas = await Finca.find({ isActive: true }).sort({ order: 1, name: 1 }).lean();

  const experiences = fincas.flatMap((finca: any) =>
    (finca.experiences || [])
      .filter((exp: any) => exp.isActive)
      .map((exp: any, i: number) => ({
        ...exp,
        // Los subdocumentos cargados fuera de Mongoose pueden no traer _id
        _id: exp._id ? exp._id.toString() : `${finca._id.toString()}-${i}`,
        fincaId: finca._id.toString(),
        fincaName: finca.name,
        fincaRegion: finca.region,
        fincaLocation: finca.location,
        fincaCover: finca.coverImage,
      }))
  );

  experiences.sort((a: any, b: any) => a.order - b.order || a.title.localeCompare(b.title));
  return JSON.parse(JSON.stringify(experiences));
}

// ── Escritura (solo admin) ──

export async function createFinca(formData: FormData) {
  await requireAdmin();
  await dbConnect();

  const coverFile = formData.get("coverImage") as File;
  let coverImage = "";
  if (coverFile && coverFile.size > 0) {
    coverImage = await saveUploadedFile(coverFile, "fincas");
  }

  const finca = await Finca.create({
    name: formData.get("name")?.toString().trim(),
    producer: formData.get("producer")?.toString().trim() || "",
    region: parseRegion(formData.get("region")),
    location: formData.get("location")?.toString().trim() || "",
    altitude: Number(formData.get("altitude")) || 0,
    varieties: parseList(formData.get("varieties")),
    processes: parseList(formData.get("processes")),
    shortDescription: formData.get("shortDescription")?.toString().trim() || "",
    description: formData.get("description")?.toString() || "",
    story: formData.get("story")?.toString() || "",
    terroir: formData.get("terroir")?.toString() || "",
    coffeeProfile: formData.get("coffeeProfile")?.toString() || "",
    coverImage,
    website: formData.get("website")?.toString().trim() || "",
    instagram: formData.get("instagram")?.toString().trim() || "",
    whatsapp: formData.get("whatsapp")?.toString().trim() || "",
    email: formData.get("email")?.toString().trim() || "",
    isActive: formData.get("isActive") === "true",
    order: Number(formData.get("order")) || 0,
    experiences: [],
  });

  revalidatePath("/admin/fincas");
  revalidatePath("/guia-de-experiencias");
  return JSON.parse(JSON.stringify(finca));
}

export async function updateFinca(id: string, formData: FormData) {
  await requireAdmin();
  await dbConnect();

  const updateData: any = {
    name: formData.get("name")?.toString().trim(),
    producer: formData.get("producer")?.toString().trim() || "",
    region: parseRegion(formData.get("region")),
    location: formData.get("location")?.toString().trim() || "",
    altitude: Number(formData.get("altitude")) || 0,
    varieties: parseList(formData.get("varieties")),
    processes: parseList(formData.get("processes")),
    shortDescription: formData.get("shortDescription")?.toString().trim() || "",
    description: formData.get("description")?.toString() || "",
    story: formData.get("story")?.toString() || "",
    terroir: formData.get("terroir")?.toString() || "",
    coffeeProfile: formData.get("coffeeProfile")?.toString() || "",
    website: formData.get("website")?.toString().trim() || "",
    instagram: formData.get("instagram")?.toString().trim() || "",
    whatsapp: formData.get("whatsapp")?.toString().trim() || "",
    email: formData.get("email")?.toString().trim() || "",
    isActive: formData.get("isActive") === "true",
    order: Number(formData.get("order")) || 0,
  };

  const coverFile = formData.get("coverImage") as File;
  if (coverFile && coverFile.size > 0) {
    updateData.coverImage = await saveUploadedFile(coverFile, "fincas");
  }

  await Finca.findByIdAndUpdate(id, updateData);

  revalidatePath("/admin/fincas");
  revalidatePath("/guia-de-experiencias");
  revalidatePath("/guia-de-experiencias/experienciasdelorigenalabarra");
}

export async function deleteFinca(id: string) {
  await requireAdmin();
  await dbConnect();

  const finca = await Finca.findById(id);
  if (finca) {
    if (finca.coverImage) await deleteUploadedFile(finca.coverImage);
    for (const exp of finca.experiences) {
      if (exp.image) await deleteUploadedFile(exp.image);
    }
    await Finca.findByIdAndDelete(id);
  }

  revalidatePath("/admin/fincas");
  revalidatePath("/guia-de-experiencias");
  revalidatePath("/guia-de-experiencias/experienciasdelorigenalabarra");
}

// ── Experiencias embebidas ──

export async function addOrUpdateExperience(
  fincaId: string,
  formData: FormData,
  experienceId?: string
) {
  await requireAdmin();
  await dbConnect();

  const finca = await Finca.findById(fincaId);
  if (!finca) throw new Error("Finca no encontrada");

  const imageFile = formData.get("image") as File;
  let image = "";
  if (imageFile && imageFile.size > 0) {
    image = await saveUploadedFile(imageFile, "experiencias");
  }

  const data: any = {
    title: formData.get("title")?.toString().trim(),
    summary: formData.get("summary")?.toString().trim() || "",
    description: formData.get("description")?.toString() || "",
    duration: formData.get("duration")?.toString().trim() || "",
    capacity: Number(formData.get("capacity")) || 0,
    price: Number(formData.get("price")) || 0,
    currency: formData.get("currency")?.toString() || "USD",
    includes: parseList(formData.get("includes")),
    languages: parseList(formData.get("languages")),
    isActive: formData.get("isActive") === "true",
    order: Number(formData.get("order")) || 0,
  };

  if (experienceId) {
    const existing = finca.experiences.id(experienceId);
    if (!existing) throw new Error("Experiencia no encontrada");
    // Conserva la imagen actual si no se subió una nueva
    Object.assign(existing, data, image ? { image } : {});
  } else {
    finca.experiences.push({ ...data, image });
  }

  await finca.save();

  revalidatePath("/admin/fincas");
  revalidatePath("/guia-de-experiencias");
  revalidatePath("/guia-de-experiencias/experienciasdelorigenalabarra");
}

export async function deleteExperience(fincaId: string, experienceId: string) {
  await requireAdmin();
  await dbConnect();

  const finca = await Finca.findById(fincaId);
  if (!finca) throw new Error("Finca no encontrada");

  const exp = finca.experiences.id(experienceId);
  if (exp) {
    if (exp.image) await deleteUploadedFile(exp.image);
    exp.deleteOne();
    await finca.save();
  }

  revalidatePath("/admin/fincas");
  revalidatePath("/guia-de-experiencias");
  revalidatePath("/guia-de-experiencias/experienciasdelorigenalabarra");
}
