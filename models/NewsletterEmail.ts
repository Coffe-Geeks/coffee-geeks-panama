import mongoose, { Schema, model, models } from "mongoose";

const NewsletterEmailSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Por favor, ingresa un correo electrónico válido"],
    },
  },
  { timestamps: true }
);

if (models && models.NewsletterEmail) {
  delete models.NewsletterEmail;
}

const NewsletterEmail = model("NewsletterEmail", NewsletterEmailSchema);
export default NewsletterEmail;
