import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la categoría es obligatorio"],
      trim: true,
    },
    cafeteriaId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "La cafetería a la que pertenece es obligatoria"],
    },
  },
  {
    timestamps: true,
  }
);

const Category = models.Category || model("Category", CategorySchema);
export default Category;
