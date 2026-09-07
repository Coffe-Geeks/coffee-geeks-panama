import mongoose, { Schema, Document } from "mongoose";

export interface IVariante {
  label: string;   // "S", "M", "L" — lo que el cliente elige
  sku: string;
  stock: number;   // -1 = sin límite
}

export interface IStoreProduct extends Document {
  name: string;
  price: number;
  sku: string;
  stock: number;
  variants: IVariante[];
  requiresShipping: boolean;
  activaPasaporte: boolean;
  retiroEnPunto: boolean;
  shortDescription: string;
  description: string; // Rich HTML format from WYSIWYG editor
  image: string; // Cover image URL
  webhook?: string; // Optional webhook redirect URL after purchase
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VarianteSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    sku: { type: String, default: "", trim: true },
    stock: { type: Number, default: -1 },
  },
  { _id: true }
);

const StoreProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      default: 0,
      min: [0, "El precio no puede ser negativo"],
    },
    sku: {
      type: String,
      trim: true,
      default: "",
    },
    /**
     * Existencias del producto sin variantes. -1 significa sin límite, que
     * es lo correcto para el pasaporte digital y cualquier producto que no
     * se agote.
     */
    stock: {
      type: Number,
      default: -1,
    },
    // Tallas o presentaciones; cada una lleva su propia existencia
    variants: {
      type: [VarianteSchema],
      default: [],
    },
    /**
     * El pasaporte digital y los cursos no se despachan, así que el
     * checkout no debe pedirles dirección de envío.
     */
    requiresShipping: {
      type: Boolean,
      default: true,
    },
    /**
     * Al confirmarse el pago, este producto activa una cuenta del Coffee
     * Geeks Passport. Es un interruptor y no una comparación por nombre o
     * SKU a propósito: renombrar el producto no debe romper la activación.
     */
    activaPasaporte: {
      type: Boolean,
      default: false,
    },
    /**
     * Tiene una parte física que el comprador retira en un punto de venta.
     * No es lo mismo que requiresShipping: no se despacha ni se cobra flete,
     * pero al comprador hay que decirle dónde recogerla.
     */
    retiroEnPunto: {
      type: Boolean,
      default: false,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    webhook: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.StoreProduct ||
  mongoose.model<IStoreProduct>("StoreProduct", StoreProductSchema);
