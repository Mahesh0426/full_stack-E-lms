import mongoose from "mongoose";

const StudentCourseSchema = new mongoose.Schema({
  userId: String,
  courses: [
    {
      courseId: String,
      title: String,
      instructorId: String,
      instructorEmail: String,
      instructorName: String,
      dateofPurschase: Date,
      courseImage: String,
    },
  ],
});

export default mongoose.model("StudentCourses", StudentCourseSchema);
