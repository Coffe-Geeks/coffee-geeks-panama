import mongoose, { Schema, model, models } from "mongoose";

const LessonSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  isVideoUploaded: { type: Boolean, default: false }, // Para saber si es un archivo local o un link externo
  order: { type: Number, required: true, default: 0 },
  duration: { type: String, default: "" }, // Ej: "10:30"
});

const CourseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    mainImage: { type: String, required: true }, // URL of the cover image
    isActive: { type: Boolean, default: true },
    lessons: { type: [LessonSchema], default: [] },
  },
  { timestamps: true }
);

if (models && models.Course) {
  delete models.Course;
}

const Course = model("Course", CourseSchema);
export default Course;
