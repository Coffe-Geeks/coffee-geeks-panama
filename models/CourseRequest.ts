import mongoose, { Schema, model, models } from "mongoose";

const CourseRequestSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // Progress tracking fields
    currentLessonIndex: { type: Number, default: 0 },
    videoTimestamp: { type: Number, default: 0 }, // Timestamp in seconds
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent a user from requesting the same course multiple times
CourseRequestSchema.index({ user: 1, course: 1 }, { unique: true });

if (models && models.CourseRequest) {
  delete models.CourseRequest;
}

const CourseRequest = model("CourseRequest", CourseRequestSchema);
export default CourseRequest;
