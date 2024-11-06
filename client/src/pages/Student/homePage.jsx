import React, { useContext, useEffect } from "react";
import banner from "../../assets/banner1.jpg";
import { courseCategories } from "@/config/signUpFormControls";
import { Button } from "@/components/ui/button";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services/registerService";
import { StudentContext } from "@/context/studentContext";
import { AuthContext } from "@/context/authContect";
import { useNavigate } from "react-router-dom";

const StudentHomePage = () => {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();

  // function to fetch  student courses
  const fetchStudentsViewCourses = async () => {
    const response = await fetchStudentViewCourseListService();

    // console.log("response", response);
    if (response?.status === "success") {
      setStudentViewCoursesList(response.data);
      return;
    }
  };

  // function to handle to coursepage navigate
  const handleNavigateToCoursesPage = (getCurrentId) => {
    console.log("getCurrentId", getCurrentId);

    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  };

  // function to  handle course navigation
  const handleCourseNavigate = async (getCurrentCourseId) => {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );
    if (response.status === "success") {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
    // console.log("response", response);
  };

  // // useeffect to fetch all the courses
  useEffect(() => {
    fetchStudentsViewCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* hero section */}
      <section className="flex flex-col lg:flex-row items-center justify-betweeen py-8 px-4 lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">Learning that gets you</h1>
          <p className="text-xl">
            Skills for your present and your future. Get Started with US
          </p>
        </div>

        <div className=" lg:w-full mb-8 lg:mb-0">
          <img
            src={banner}
            width={500}
            height={300}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* courses categories section */}
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Courses Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start"
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>

      {/* feature courses section */}
      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xll font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                onClick={() => handleCourseNavigate(courseItem?._id)}
                key={courseItem?._id}
                className="border rounded-lg overflow-hidden shadow cursor-pointer transition-all duration-300 ease-in hover:shadow-lg hover:scale-105"
              >
                <img
                  src={courseItem?.image}
                  alt=" course images"
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {courseItem?.userName}
                  </p>
                  <p className="font-bold text-[16px]">
                    ${courseItem?.pricing}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h1>NO Course available</h1>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentHomePage;
