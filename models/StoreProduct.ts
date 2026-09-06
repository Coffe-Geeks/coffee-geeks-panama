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
