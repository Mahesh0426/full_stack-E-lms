import express from "express";
import {
  checkCoursePurchaseInfo,
  getStudentViewCourses,
  getStudentViewCoursesDetails,
} from "../controllers/student-controller/AllCourseController.js";

const studentRouter = express.Router();

studentRouter.get("/get", getStudentViewCourses);
studentRouter.get("/get/details/:id", getStudentViewCoursesDetails);
studentRouter.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo);

export default studentRouter;
