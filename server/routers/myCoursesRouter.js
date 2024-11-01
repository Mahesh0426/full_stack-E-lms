import express from "express";
import { getMyBoughtCoursesById } from "../controllers/student-controller/myCourseController.js";

const myCoursesRouter = express.Router();

// GET | Get my courses | private
myCoursesRouter.get("/get/:studentId", getMyBoughtCoursesById);

export default myCoursesRouter;
