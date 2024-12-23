import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config/signUpFormControls";
import { InstructorContext } from "@/context/instructor-context";

import { Edit, Trash2 } from "lucide-react";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

const InstructorCourses = (props) => {
  const { listOfCourse } = props;
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  const navigate = useNavigate();

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle className="text-3xl font-extrabold">
            {" "}
            All courses
          </CardTitle>
          <Button
            onClick={() => {
              setCurrentEditedCourseId(null);
              setCourseLandingFormData(courseLandingInitialFormData);
              setCourseCurriculumFormData(courseCurriculumInitialFormData);
              navigate("/instructor/create-new-course");
            }}
            className="p-6"
          >
            Create new course
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listOfCourse && listOfCourse.length > 0
                  ? listOfCourse.map((course, index) => (
                      <TableRow key={course?._id || index}>
                        <TableCell className="font-medium">
                          {course?.title}
                        </TableCell>
                        <TableCell>{course?.students?.length}</TableCell>
                        <TableCell>{course?.pricing}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => {
                              navigate(
                                `/instructor/edit-course/${course?._id}`
                              );
                            }}
                            variant="ghost"
                            size="sm"
                          >
                            <Edit className="h-6 w-6" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-6 w-6" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default InstructorCourses;
