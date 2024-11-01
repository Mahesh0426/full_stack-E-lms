import express from "express";
import {
  getStudentViewCourses,
  getStudentViewCoursesDetails,
} from "../controllers/student-controller/AllCourseController.js";

const studentRouter = express.Router();

studentRouter.get("/get", getStudentViewCourses);
studentRouter.get("/get/details/:id", getStudentViewCoursesDetails);

export default studentRouter;
