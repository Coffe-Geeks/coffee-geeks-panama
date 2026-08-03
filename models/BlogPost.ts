import mongoose, { Schema, Document } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  mainImage: string;
  shortDescription: string;
  content: string; // HTML
  isPublished: boolean;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    mainImage: { type: String },
    shortDescription: { type: String },
    content: { type: String },
    isPublished: { type: Boolean, default: true },
    author: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
