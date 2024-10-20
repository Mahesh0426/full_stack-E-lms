import express from "express";
import {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
} from "../controllers/instructor-controller/courseController.js";

const courseRouter = express.Router();

// GET | Get all courses | public
courseRouter.get("/get", getAllCourses);

//GET | Get course details | public
courseRouter.get("/get/details/:id", getCourseDetailsByID);

// POST | Create a new course | protected
courseRouter.post("/add", addNewCourse);

/// PUT | Update a course | protected
courseRouter.put("/update/:id", updateCourseByID);

export default courseRouter;
