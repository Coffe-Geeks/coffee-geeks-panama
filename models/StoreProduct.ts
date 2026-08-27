import mongoose, { Schema, Document } from "mongoose";

export interface IStoreProduct extends Document {
  name: string;
  price: number;
  shortDescription: string;
  description: string; // Rich HTML format from WYSIWYG editor
  image: string; // Cover image URL
  webhook?: string; // Optional webhook redirect URL after purchase
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
