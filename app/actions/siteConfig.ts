"use server";

import { getSession } from "@/lib/session";
import dbConnect from "@/lib/mongodb";
import SiteConfig from "@/models/SiteConfig";
import { revalidatePath } from "next/cache";

// ─── Guardar configuración (solo admin) ───────────────────────────────────────
export async function updateSiteConfig(state: any, formData: FormData) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return { error: "No autorizado." };
    }

    await dbConnect();

    const seoTitle       = formData.get("seoTitle")?.toString().trim() ?? "";
    const seoDescription = formData.get("seoDescription")?.toString().trim() ?? "";
    const ogImage        = formData.get("ogImage")?.toString().trim() ?? "";
    const contactEmail   = formData.get("contactEmail")?.toString().trim() ?? "";
    const contactPhone   = formData.get("contactPhone")?.toString().trim() ?? "";
    const contactWhatsApp = formData.get("contactWhatsApp")?.toString().trim() ?? "";
    const contactPhone2  = formData.get("contactPhone2")?.toString().trim() ?? "";
    const address        = formData.get("address")?.toString().trim() ?? "";

    const facebook       = formData.get("facebook")?.toString().trim() ?? "";
    const instagram      = formData.get("instagram")?.toString().trim() ?? "";
    const twitter        = formData.get("twitter")?.toString().trim() ?? "";
    const youtube        = formData.get("youtube")?.toString().trim() ?? "";

    const heroEyebrow    = formData.get("heroEyebrow")?.toString().trim() ?? "";
    const heroTitle1     = formData.get("heroTitle1")?.toString().trim() ?? "";
    const heroTitle2     = formData.get("heroTitle2")?.toString().trim() ?? "";
    const heroDescription = formData.get("heroDescription")?.toString() ?? "";

    const privacyPolicy  = formData.get("privacyPolicy")?.toString() ?? "";
    const guiaParticipante = formData.get("guiaParticipante")?.toString() ?? "";
    const guiaConsumidor = formData.get("guiaConsumidor")?.toString() ?? "";
    const termsAndConditions = formData.get("termsAndConditions")?.toString() ?? "";
    const dataProtection = formData.get("dataProtection")?.toString() ?? "";
    const purchasePolicy = formData.get("purchasePolicy")?.toString() ?? "";
    const cancellationPolicy = formData.get("cancellationPolicy")?.toString() ?? "";
    
    const maxGalleryImagesStr = formData.get("maxGalleryImages")?.toString().trim();
    const maxGalleryImages = maxGalleryImagesStr ? parseInt(maxGalleryImagesStr, 10) : 3;
    
    const votingEndDate = formData.get("votingEndDate")?.toString().trim() ?? "";

    // Usamos updateOne con upsert para asegurar que el registro único se cree o actualice
    await SiteConfig.updateOne(
      {}, // filtro vacío para el singleton
      { 
        $set: {
          seoTitle, 
          seoDescription, 
          ogImage, 
          contactEmail, 
          contactPhone, 
          contactWhatsApp,
          contactPhone2,
          address, 
          facebook,
          instagram,
          twitter,
          youtube,
          heroEyebrow,
          heroTitle1,
          heroTitle2,
          heroDescription,
          privacyPolicy, 
          guiaParticipante,
          guiaConsumidor,
          termsAndConditions,
          dataProtection,
          purchasePolicy,
          cancellationPolicy,
          maxGalleryImages, 
          votingEndDate 
        } 
      },
      { upsert: true }
    );

    // Forzamos revalidación de todas las rutas posibles que usen este dato
    revalidatePath("/admin/settings", "page");
    revalidatePath("/admin/settings", "layout");
    revalidatePath("/", "page");
    revalidatePath("/home", "page");
    revalidatePath("/privacidad", "page");
    revalidatePath("/guia-participante", "page");
    revalidatePath("/guia-consumidor", "page");
    revalidatePath("/terminos", "page");
    revalidatePath("/datos-personales", "page");
    revalidatePath("/politica-de-compras", "page");
    revalidatePath("/politica-de-cancelaciones", "page");

    return { success: "Configuración guardada correctamente." };
  } catch (err) {
    console.error("Error in updateSiteConfig:", err);
    return { error: "Error al guardar la configuración." };
  }
}
