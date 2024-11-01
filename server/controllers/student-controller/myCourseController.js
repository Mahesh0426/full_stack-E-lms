import StudentCourses from "../../model/studentSchema.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../../utility/responseHelper.js";

//get the student courses by id
const getMyBoughtCoursesById = async (req, res) => {
  try {
    const { studentId } = req.params;
    const myCourses = await StudentCourses.findOne({ userId: studentId });
    if (myCourses) {
      buildSuccessResponse(
        res,
        myCourses.courses,
        "Your courses fetched successfully!"
      );
    } else {
      buildErrorResponse(res, "No courses found for this student", 404);
    }
  } catch (error) {
    console.error("Error geting your courses:", error);
    buildErrorResponse(
      res,
      "Some error occurred while geting your courses",
      500
    );
  }
};

export { getMyBoughtCoursesById };
