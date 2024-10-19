import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  public_id: { type: String, required: true },
  freePreview: { type: Boolean, default: false },
});

const courseSchema = new mongoose.Schema(
  {
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    instructorName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    primaryLanguage: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    welcomeMessage: {
      type: String,
      required: true,
    },
    pricing: {
      type: Number,
      required: true,
      min: 0,
    },
    objectives: {
      type: String,
      required: true,
    },
    students: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        studentName: String,
        studentEmail: { type: String, required: true },
        paidAmount: Number,
        enrolledAt: { type: Date, default: Date.now },
      },
    ],
    curriculum: [lectureSchema],
    isPublised: Boolean,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Course", courseSchema);
