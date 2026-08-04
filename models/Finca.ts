import mongoose, { Schema, model, models } from "mongoose";
import { FINCA_REGIONS } from "@/lib/finca-constants";

// Reexportadas por conveniencia para el código de servidor
export { FINCA_REGIONS, PROCESS_TYPES, isFincaRegion } from "@/lib/finca-constants";
export type { FincaRegion } from "@/lib/finca-constants";

// ── Experiencia que una finca ofrece en "Del Origen a la Barra" ──
const ExperienceSchema = new Schema({
  title: { type: String, required: true, trim: true },
  summary: { type: String, default: "", trim: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  // Duración en texto libre para admitir "3 horas", "2 días / 1 noche", etc.
  duration: { type: String, default: "" },
  // Personas por tanda; 0 = sin límite definido
  capacity: { type: Number, default: 0, min: 0 },
  price: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: "USD" },
  includes: { type: [String], default: [] },
  languages: { type: [String], default: ["Español"] },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

const FincaSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    // Nombre del productor o familia detrás de la finca
    producer: { type: String, default: "", trim: true },
    region: { type: String, enum: FINCA_REGIONS, default: "Boquete" },
    // Corregimiento o referencia más específica dentro de la región
    location: { type: String, default: "", trim: true },
    // Altitud en msnm; el rango real en Panamá va de ~1000 a ~2000
    altitude: { type: Number, default: 0, min: 0 },
    varieties: { type: [String], default: [] },
    processes: { type: [String], default: [] },
    shortDescription: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    // Historia del productor y la familia detrás de la finca
    story: { type: String, default: "" },
    // Suelo, clima, sombra: lo que hace única a esta tierra
    terroir: { type: String, default: "" },
    // Notas de taza y perfil sensorial
    coffeeProfile: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    // Fotos del carrusel de la ficha de finca
    gallery: { type: [String], default: [] },
    website: { type: String, default: "", trim: true },
    instagram: { type: String, default: "", trim: true },
    whatsapp: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    // Coordenadas para el mapa; null cuando no se han cargado
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    experiences: { type: [ExperienceSchema], default: [] },
  },
  { timestamps: true }
);

// Mismo patrón que el resto de modelos: forzar re-registro para recoger cambios de esquema
if (models && models.Finca) {
  delete models.Finca;
}

const Finca = model("Finca", FincaSchema);
export default Finca;
