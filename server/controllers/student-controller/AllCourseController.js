import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../../utility/responseHelper.js";
import Course from "../../model/courseSchema.js";
import {
  buildFilters,
  buildSortParam,
} from "../../utility/filter&SortingHelper.js";
import StudentCourses from "../../model/studentSchema.js";

//get all the courses
export const getStudentViewCourses = async (req, res) => {
  try {
    // Destructure query params with default values
    const {
      category = "",
      level = "",
      primaryLanguage = "",
      sortBy = "price-lowtohigh",
    } = req.query;

    // Build filters and sorting options using utility functions
    const filters = buildFilters(category, level, primaryLanguage);
    const sortParam = buildSortParam(sortBy);

    // Query the database with filters and sorting
    const courseList = await Course.find(filters).sort(sortParam);

    // Respond with success if courses are found
    buildSuccessResponse(res, courseList, "Courses fetched successfully!");
  } catch (error) {
    console.error("Error fetching courses:", error);
    buildErrorResponse(res, "Some error occurred while fetching courses", 500);
  }
};

//get  the courses by id
export const getStudentViewCoursesDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const courseDetails = await Course.findById(id);

    courseDetails?._id
      ? buildSuccessResponse(
          res,
          courseDetails,
          "fetched course detail successfully!!"
        )
      : buildErrorResponse(res, "could not get course details!!");
  } catch (error) {
    console.log(error);
    buildErrorResponse(res, "Some error occurred", 500);
  }
};

// Check if the course is purchased by the student
export const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id: courseId, studentId } = req.params;

    // Fetch the student's courses
    const studentCourses = await StudentCourses.findOne({ userId: studentId });

    // Check if the student has purchased the course
    const isCoursePurchased = studentCourses?.courses.some(
      (item) => item.courseId === courseId
    );

    if (isCoursePurchased) {
      buildSuccessResponse(res, true, "Course has already been purchased!");
    } else {
      buildSuccessResponse(res, false, "Course has not been purchased yet.");
    }
  } catch (error) {
    console.error("Error checking course purchase info:", error);
    buildErrorResponse(
      res,
      "Some error occurred while checking course purchase info.",
      500
    );
  }
};
