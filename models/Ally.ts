import mongoose, { Schema, model, models } from "mongoose";

const AllySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: "" },
    // Sitio del aliado; si está vacío el logo no enlaza a ningún lado
    url: { type: String, default: "", trim: true },
    /**
     * Marca los logos que vienen en blanco o en tonos muy claros
     * (por ejemplo Sanremo). Sobre el fondo claro de la sección
     * desaparecerían, así que se invierten al pintarlos.
     */
    isLightLogo: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Mismo patrón que el resto de modelos: forzar re-registro del esquema
if (models && models.Ally) {
  delete models.Ally;
}

const Ally = model("Ally", AllySchema);
export default Ally;
