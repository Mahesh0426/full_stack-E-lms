import React, { useContext, useEffect } from "react";

import { StudentContext } from "@/context/studentContext";
import { getMyBoughtCoursesService } from "@/services/registerService";
import { toast } from "@/hooks/use-toast";
import { AuthContext } from "@/context/authContect";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Watch } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyCoursesPage = () => {
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();

  // Function to fetch the list of bought courses
  const fetchBoughtCourses = async () => {
    try {
      if (!auth?.user?._id) {
        throw new Error("User not authenticated or user ID is missing");
      }

      const response = await getMyBoughtCoursesService(auth?.user?._id);

      if (response.status === "success") {
        setStudentBoughtCoursesList(response?.data);
      } else {
        toast.error(response.message || "Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // useEffect to fetch courses when the component mounts
  useEffect(() => {
    fetchBoughtCourses();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((course) => (
            <Card key={course._id} className="flex flex-col">
              <CardContent className="p-4 flex-grow">
                <img
                  src={course?.courseImage}
                  alt={course?.title}
                  className="h-52 w-full object-cover rounded-md mb-4"
                />
                <h3 className="font-bold mb-1">{course?.title}</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {course?.instructorName}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() =>
                    navigate(`/course-progress/${course?.courseId}`)
                  }
                  className="flex-1"
                >
                  <Watch className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <h1 className="text-3xl font-bold">No Courses found</h1>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
