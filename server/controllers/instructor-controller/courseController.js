import Course from "../../models/courseSchema.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../../utility/responseHelper.js";

// Add a new course | POST | Protected Route
const addNewCourse = async (req, res) => {
  const courseData = req.body;

  try {
    const newCourse = new Course(courseData);
    const savedCourse = await newCourse.save();

    return buildSuccessResponse(res, savedCourse, "Course saved successfully!");
  } catch (error) {
    console.error("Error while adding course:", error);
    return buildErrorResponse(res, "Error while saving course!", 500);
  }
};

// Get all courses | GET | Protected Route
const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});
    return buildSuccessResponse(
      res,
      coursesList,
      "Courses fetched successfully!"
    );
  } catch (error) {
    console.error("Error while getting courses:", error);
    return buildErrorResponse(res, "Error while retrieving courses", 500);
  }
};

// get  a course | GET | Protected Route
const getCourseDetailsByID = async (req, res) => {
  const { id } = req.params;

  try {
    const courseDetails = await Course.findById(id);

    return courseDetails
      ? buildSuccessResponse(
          res,
          courseDetails,
          "Course details retrieved successfully!"
        )
      : buildErrorResponse(res, "Course not found!", 404);
  } catch (error) {
    console.error("Error while getting course Dstails:", error);
    return buildErrorResponse(
      res,
      "Error while retrieving course Details!",
      500
    );
  }
};

// Update course by ID | PUT | Protected Route
const updateCourseByID = async (req, res) => {
  const { id } = req.params;
  const updatedCourseData = req.body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updatedCourseData,
      { new: true }
    );

    return updatedCourse
      ? buildSuccessResponse(res, updatedCourse, "Course updated successfully!")
      : buildErrorResponse(res, "Course not found!", 404);
  } catch (error) {
    console.error("Error while updating course:", error);
    return buildErrorResponse(res, "Error while updating course!", 500);
  }
};

export { addNewCourse, getAllCourses, updateCourseByID, getCourseDetailsByID };
