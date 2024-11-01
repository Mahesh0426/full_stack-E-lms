import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../../utility/responseHelper.js";
import Course from "../../model/courseSchema.js";
import {
  buildFilters,
  buildSortParam,
} from "../../utility/filter&SortingHelper.js";

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
