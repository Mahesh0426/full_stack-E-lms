import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../../utility/responseHelper.js";
import Course from "../../models/courseSchema.js";

//get all the courses
export const getStudentViewCourses = async (req, res) => {
  try {
    const courseList = await Course.find({});

    courseList?.length
      ? buildSuccessResponse(res, courseList, "fetched course successfully!!")
      : buildErrorResponse(res, "No courses available!!", 404);
  } catch (error) {
    console.log(error);
    buildErrorResponse(res, "Some error occurred!!", 500);
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
