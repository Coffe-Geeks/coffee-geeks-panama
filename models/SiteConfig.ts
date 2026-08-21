import mongoose, { Schema, model, models } from "mongoose";

// Documento singleton — siempre habrá solo uno (se usa findOneAndUpdate con upsert)
const SiteConfigSchema = new Schema(
  {
    // SEO
    seoTitle: { type: String, default: "Coffee Geeks Panamá" },
    seoDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" }, // URL pública de la imagen OG

    // Contacto
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    contactWhatsApp: { type: String, default: "" },
    contactPhone2: { type: String, default: "" },
    address: { type: String, default: "" },

    // Redes Sociales
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
    youtube: { type: String, default: "" },

    // Hero
    heroEyebrow: { type: String, default: "Coffee Geeks Panamá" },
    heroTitle1: { type: String, default: "El Camino" },
    heroTitle2: { type: String, default: "a la Gran Taza" },
    heroDescription: { type: String, default: "" },

    // Legal y Guías
    privacyPolicy: { type: String, default: "" },
    guiaParticipante: { type: String, default: "" },
    guiaConsumidor: { type: String, default: "" },
    termsAndConditions: { type: String, default: "" },
    dataProtection: { type: String, default: "" },

    // Cafeterías
    maxGalleryImages: { type: Number, default: 3 },
    
    // Votaciones
    currentVotingRound: { type: Number, default: 0 }, // 0: Cerrado, 1: Ronda 1, 2: Ronda 2
    votingEndDate: { type: String, default: "" },
    // Interruptor del voto popular simplificado (barista 1–5 + bebida
    // favorita). Se enciende desde la base de datos, sin desplegar.
    publicVotingEnabled: { type: Boolean, default: false },
  },
  { timestamps: true, strict: false } // Usamos strict: false para permitir campos nuevos si el modelo ya estaba cacheado
);

// En desarrollo, Next.js puede cachear el modelo con el esquema antiguo.
// Si el modelo ya existe, intentamos asegurarnos de que reconozca los nuevos campos.
const SiteConfig = models.SiteConfig || model("SiteConfig", SiteConfigSchema);

export default SiteConfig;
