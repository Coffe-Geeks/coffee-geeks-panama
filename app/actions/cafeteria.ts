"use server";

import { getSession } from "@/lib/session";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// ─── Utilidad: guardar imagen en <project_root>/uploads/ ──────────────────────
async function saveUploadedFile(file: File, subfolder = ""): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = path.join(process.cwd(), "uploads", subfolder);
  await mkdir(uploadDir, { recursive: true });
  const ext = file.name.split(".").pop() ?? "webp";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  return subfolder ? `/api/uploads/${subfolder}/${filename}` : `/api/uploads/${filename}`;
}

async function getTargetUser(session: any, formData?: FormData, explicitTargetId?: string) {
  if (session?.role === "admin") {
    const targetId = formData ? formData.get("targetUserId")?.toString() : explicitTargetId;
    return { targetUserId: targetId || session.userId, isAdmin: true };
  }
  if (!session || session.role !== "cafeteria") {
    throw new Error("No autorizado.");
  }
  return { targetUserId: session.userId, isAdmin: false };
}

function doRevalidate(isAdmin: boolean) {
  if (isAdmin) revalidatePath("/admin/users");
  revalidatePath("/perfil");
}

// ─── Actualizar perfil base de cafetería ──────────────────────────────────────
export async function updateCafeteriaProfile(state: any, formData: FormData) {
  try {
    const session = await getSession();
    const { targetUserId, isAdmin } = await getTargetUser(session, formData);

    await dbConnect();

    const updateData: Record<string, any> = {};
    if (formData.has("cafeteriaName")) updateData.cafeteriaName = formData.get("cafeteriaName")?.toString().trim() ?? "";
    if (formData.has("legalRepresentative")) updateData.legalRepresentative = formData.get("legalRepresentative")?.toString().trim() ?? "";
    if (formData.has("ruc")) updateData.ruc = formData.get("ruc")?.toString().trim() ?? "";
    if (formData.has("neighborhood")) updateData.neighborhood = formData.get("neighborhood")?.toString().trim() ?? "";
    if (formData.has("description")) updateData.description = formData.get("description")?.toString().trim() ?? "";
    if (formData.has("hours")) updateData.hours = formData.get("hours")?.toString().trim() ?? "";
    if (formData.has("phone")) updateData.phone = formData.get("phone")?.toString().trim() ?? "";
    if (formData.has("web")) updateData.web = formData.get("web")?.toString().trim() ?? "";
    if (formData.has("businessType")) updateData.businessType = formData.get("businessType")?.toString().trim() ?? "coffee";
    
    if (formData.has("competitionCategory")) {
      updateData.competitionCategory = formData.getAll("competitionCategory").map(c => c.toString().trim()).filter(c => c);
    }

    if (formData.has("locationLat")) {
      const val = formData.get("locationLat")?.toString().trim();
      if (val) updateData.locationLat = parseFloat(val);
    }
    if (formData.has("locationLng")) {
      const val = formData.get("locationLng")?.toString().trim();
      if (val) updateData.locationLng = parseFloat(val);
    }

    const coverFile = formData.get("coverImage") as File | null;
    if (coverFile && coverFile.size > 0) {
      // Validación de tamaño y formato
      if (coverFile.size > 2 * 1024 * 1024) {
        return { error: "La foto de portada no debe exceder los 2MB." };
      }
      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedFormats.includes(coverFile.type)) {
        return { error: "Formato de imagen no permitido. Usa .jpg, .png o .webp." };
      }
      updateData.coverImage = await saveUploadedFile(coverFile, "covers");
    }

    await User.findByIdAndUpdate(targetUserId, updateData);
    doRevalidate(isAdmin);

    return { success: "Perfil de cafetería actualizado correctamente." };
  } catch (err) {
    console.error(err);
    return { error: "Error al actualizar el perfil." };
  }
}

// ─── Agregar un barista ───────────────────────────────────────────────────────
export async function addBarista(state: any, formData: FormData) {
  try {
    const session = await getSession();
    const { targetUserId, isAdmin } = await getTargetUser(session, formData);

    const fullName = formData.get("fullName")?.toString().trim() ?? "";
    if (!fullName) return { error: "El nombre completo es obligatorio." };

    await dbConnect();

    let photoUrl = "";
    const photoFile = formData.get("photo") as File | null;
    if (photoFile && photoFile.size > 0) {
      if (photoFile.size > 2 * 1024 * 1024) {
        return { error: "La foto del barista no debe exceder los 2MB." };
      }
      const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedFormats.includes(photoFile.type)) {
        return { error: "Formato de imagen no permitido. Usa .jpg, .png o .webp." };
      }
      photoUrl = await saveUploadedFile(photoFile, "baristas");
    }

    await User.findByIdAndUpdate(targetUserId, {
      $push: { baristas: { fullName, photo: photoUrl, isHighlighted: false } },
    });

    doRevalidate(isAdmin);
    return { success: "Barista agregado." };
  } catch (err) {
    console.error(err);
    return { error: "Error al agregar barista." };
  }
}

// ─── Eliminar un barista por _id ──────────────────────────────────────────────
export async function deleteBarista(baristaId: string, explicitTargetId?: string) {
  try {
    const session = await getSession();
    const { targetUserId, isAdmin } = await getTargetUser(session, undefined, explicitTargetId);

    await dbConnect();
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { baristas: { _id: baristaId } },
    });

    doRevalidate(isAdmin);
    return { success: "Barista eliminado." };
  } catch (err) {
    return { error: "Error al eliminar barista." };
  }
}

// ─── Marcar barista destacado (solo uno a la vez) ─────────────────────────────
export async function setHighlightedBarista(baristaId: string, explicitTargetId?: string) {
  try {
    const session = await getSession();
    const { targetUserId, isAdmin } = await getTargetUser(session, undefined, explicitTargetId);

    await dbConnect();

    // Quitar highlight de todos
    await User.updateOne(
      { _id: targetUserId },
      { $set: { "baristas.$[].isHighlighted": false } }
    );

    // Activar solo el seleccionado
    await User.updateOne(
      { _id: targetUserId, "baristas._id": baristaId },
      { $set: { "baristas.$.isHighlighted": true } }
    );

    doRevalidate(isAdmin);
    return { success: "Barista destacado actualizado." };
  } catch (err) {
    return { error: "Error al destacar barista." };
  }
}

// ─── Subir imágenes a la galería ──────────────────────────────────────────────
export async function uploadGalleryImages(state: any, formData: FormData) {
  try {
    const session = await getSession();
    const { targetUserId, isAdmin } = await getTargetUser(session, formData);

    await dbConnect();
    const { getSiteConfig } = await import("@/lib/siteConfig");
    const config = await getSiteConfig();
    const maxImages = config.maxGalleryImages;

    const user = await User.findById(targetUserId);
    if (!user) return { error: "Usuario no encontrado." };

    const files = formData.getAll("gallery") as File[];
    const validFiles = files.filter(f => f.size > 0);

    if ((user.gallery?.length || 0) + validFiles.length > maxImages) {
      return { error: `Solo puedes tener hasta ${maxImages} imágenes en tu galería.` };
    }

    const newUrls = [];
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    for (const file of validFiles) {
      if (file.size > 2 * 1024 * 1024) {
        return { error: `La imagen ${file.name} excede los 2MB.` };
      }
      if (!allowedFormats.includes(file.type)) {
        return { error: `Formato de ${file.name} no permitido. Usa .jpg, .png o .webp.` };
      }
      newUrls.push(await saveUploadedFile(file, "gallery"));
    }

    if (newUrls.length > 0) {
      await User.findByIdAndUpdate(targetUserId, {
        $push: { gallery: { $each: newUrls } }
      });
    }

    doRevalidate(isAdmin);
    return { success: "Imágenes añadidas a la galería." };
  } catch (err) {
    console.error(err);
    return { error: "Error al actualizar la galería." };
  }
}

// ─── Eliminar imagen de la galería ───────────────────────────────────────────
export async function deleteGalleryImage(imageUrl: string, explicitTargetId?: string) {
  try {
    const session = await getSession();
    const { targetUserId, isAdmin } = await getTargetUser(session, undefined, explicitTargetId);

    await dbConnect();
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { gallery: imageUrl }
    });

    doRevalidate(isAdmin);
    return { success: "Imagen eliminada." };
  } catch (err) {
    return { error: "Error al eliminar la imagen." };
  }
}

// ─── Alternar estado de activación (Solo Admin) ─────────────────────────────────
export async function toggleCafeteriaStatus(userId: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return { error: "No autorizado." };
    }

    await dbConnect();
    const user = await User.findById(userId);
    if (!user) return { error: "Usuario no encontrado." };

    user.isActive = !user.isActive;
    await user.save();
    
    revalidatePath("/admin/users", "page");
    revalidatePath("/home", "page");
    revalidatePath("/participantes", "page");
    
    return { success: `Cafetería ${user.isActive ? 'activada' : 'desactivada'}.` };
  } catch (err) {
    console.error("Error toggling status:", err);
    return { error: "Error al cambiar el estado en el servidor." };
  }
}

// ─── Actualizar perfil DETALLADO de cafetería (Solo Admin) ─────────────────────
export async function updateDetailedCafeteriaProfile(state: any, formData: FormData) {
  try {
    const session = await getSession();
    if (session?.role !== "admin") return { error: "No autorizado." };

    const { targetUserId } = await getTargetUser(session, formData);
    await dbConnect();

    const updateData: any = {
      legalRepresentative: formData.get("legalRepresentative")?.toString().trim() ?? "",
      legalRepresentativePosition: formData.get("legalRepresentativePosition")?.toString().trim() ?? "",
      ruc: formData.get("ruc")?.toString().trim() ?? "",
      legalName: formData.get("legalName")?.toString().trim() ?? "",
      cafeteriaName: formData.get("cafeteriaName")?.toString().trim() ?? "",
      operationNotice: formData.get("operationNotice")?.toString().trim() ?? "",
      province: formData.get("province")?.toString().trim() ?? "",
      neighborhood: formData.get("neighborhood")?.toString().trim() ?? "",
      locationLat: formData.get("locationLat") ? parseFloat(formData.get("locationLat")!.toString()) : null,
      locationLng: formData.get("locationLng") ? parseFloat(formData.get("locationLng")!.toString()) : null,
      yearsOfExistence: parseInt(formData.get("yearsOfExistence")?.toString() || "0"),
      branchesCount: parseInt(formData.get("branchesCount")?.toString() || "1"),
      totalBaristas: parseInt(formData.get("totalBaristas")?.toString() || "0"),
      sellsPanamanianCoffee: formData.get("sellsPanamanianCoffee") === "true",
      farmName: formData.get("farmName")?.toString().trim() ?? "",
      coffeeVarieties: formData.get("coffeeVarietiesText")?.toString().split(",").map(v => v.trim()).filter(v => v) || [],
      machineBrand: formData.get("machineBrand")?.toString().trim() ?? "",
      grinderBrand: formData.get("grinderBrand")?.toString().trim() ?? "",
      roastsOwnCoffee: formData.get("roastsOwnCoffee") === "true",
      makesOwnProfile: formData.get("makesOwnProfile") === "true",
      coffeeExperiences: formData.get("coffeeExperiences")?.toString().trim() ?? "",
      wantsToInternationalize: formData.get("wantsToInternationalize") === "true",
      targetMarkets: formData.get("targetMarkets")?.toString().trim() ?? "",
      acceptsNotifications: formData.get("acceptsNotifications") === "true",

      // Detalle Barista
      mainBaristaName: formData.get("mainBaristaName")?.toString().trim() ?? "",
      mainBaristaTraining: formData.get("mainBaristaTraining")?.toString().trim() ?? "",
      mainBaristaSpecialty: formData.get("mainBaristaSpecialty")?.toString().trim() ?? "",
      mainBaristaYearsExp: parseInt(formData.get("mainBaristaYearsExp")?.toString() || "0"),
      mainBaristaCertified: formData.get("mainBaristaCertified") === "true",
      mainBaristaSCA: formData.get("mainBaristaSCA") === "true",
      femaleBaristasCount: parseInt(formData.get("femaleBaristasCount")?.toString() || "0"),
      maleBaristasCount: parseInt(formData.get("maleBaristasCount")?.toString() || "0"),
      trainingLevel: formData.get("trainingLevel")?.toString().trim() ?? "",
      hasCertifiedTraining: formData.get("hasCertifiedTraining") === "true",
      trainingSCA: formData.get("trainingSCA") === "true",
      trainingInstructor: formData.get("trainingInstructor")?.toString().trim() ?? "",
      interestInCertification: formData.get("interestInCertification") === "true",
      certificationInterests: formData.get("certificationInterestsText")?.toString().split(",").map(v => v.trim()).filter(v => v) || [],
      wantsToJoinCommittee: formData.get("wantsToJoinCommittee") === "true",
      hasDisabledStaff: formData.get("hasDisabledStaff") === "true",
    };

    await User.findByIdAndUpdate(targetUserId, { $set: updateData });
    revalidatePath("/admin/users");
    
    return { success: "Información detallada actualizada." };
  } catch (err) {
    console.error(err);
    return { error: "Error al actualizar información detallada." };
  }
}

