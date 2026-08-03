import dbConnect from "@/lib/mongodb";
import SiteConfig from "@/models/SiteConfig";
import { unstable_noStore as noStore } from "next/cache";

// ─── Leer configuración (sin verificar sesión, usable desde layout y páginas SSR) ───
export async function getSiteConfig() {
  noStore();
  await dbConnect();
  // Forzamos que no use caché de Mongoose y que sea una consulta fresca
  const config = await SiteConfig.findOne({}).sort({ updatedAt: -1 }).lean().exec();
  
  if (!config) {
    return {
      seoTitle: "Coffee Geeks Panamá",
      seoDescription: "",
      ogImage: "",
      contactEmail: "",
      contactPhone: "",
      contactWhatsApp: "",
      contactPhone2: "",
      address: "",
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      heroEyebrow: "Coffee Geeks Panamá",
      heroTitle1: "El Camino",
      heroTitle2: "a la Gran Taza",
      heroDescription: "",
      privacyPolicy: "",
      guiaParticipante: "",
      guiaConsumidor: "",
      termsAndConditions: "",
      dataProtection: "",
      maxGalleryImages: 3,
      votingEndDate: "",
      currentVotingRound: 0,
    };
  }

  return {
    seoTitle: (config as any).seoTitle ?? "Coffee Geeks Panamá",
    seoDescription: (config as any).seoDescription ?? "",
    ogImage: (config as any).ogImage ?? "",
    contactEmail: (config as any).contactEmail ?? "",
    contactPhone: (config as any).contactPhone ?? "",
    contactWhatsApp: (config as any).contactWhatsApp ?? "",
    contactPhone2: (config as any).contactPhone2 ?? "",
    address: (config as any).address ?? "",
    facebook: (config as any).facebook ?? "",
    instagram: (config as any).instagram ?? "",
    twitter: (config as any).twitter ?? "",
    youtube: (config as any).youtube ?? "",
    heroEyebrow: (config as any).heroEyebrow ?? "Coffee Geeks Panamá",
    heroTitle1: (config as any).heroTitle1 ?? "El Camino",
    heroTitle2: (config as any).heroTitle2 ?? "a la Gran Taza",
    heroDescription: (config as any).heroDescription ?? "",
    privacyPolicy: (config as any).privacyPolicy ?? "",
    guiaParticipante: (config as any).guiaParticipante ?? "",
    guiaConsumidor: (config as any).guiaConsumidor ?? "",
    termsAndConditions: (config as any).termsAndConditions ?? "",
    dataProtection: (config as any).dataProtection ?? "",
    maxGalleryImages: (config as any).maxGalleryImages ?? 3,
    votingEndDate: (config as any).votingEndDate ?? "",
    currentVotingRound: (config as any).currentVotingRound ?? 0,
  };
}
