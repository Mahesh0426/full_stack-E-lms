import React, { useContext, useEffect } from "react";
import CourseCurriculum from "@/components/instructor-view/courses/create-New-Course/CourseCurriculum";
import CourseLanding from "@/components/instructor-view/courses/create-New-Course/CourseLanding";
import CourseSetting from "@/components/instructor-view/courses/create-New-Course/CourseSetting";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InstructorContext } from "@/context/instructor-context";
import { AuthContext } from "@/context/authContect";
import { addNewCourseService } from "@/services/registerService";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config/signUpFormControls";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";

const CreateNewCoursePage = () => {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  console.log("params", params);

  // Helper function to check if value is empty
  const isEmpty = (value) => {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === "" || value === null || value === undefined;
  };

  // Function to validate form data
  const validateFormData = () => {
    // Validate course landing form data
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    let hasFreePreview = false;

    // Validate curriculum data
    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }
      if (item.freePreview) {
        hasFreePreview = true;
      }
    }

    return hasFreePreview; // Ensure at least one free preview is available
  };

  // function to handle create course
  const handleOnSubmit = async () => {
    const courseSubmittedFormData = {
      instructorId: auth?.user?.id,
      instructorName: auth?.user?.userName,
      instructorEmail: auth?.user?.email,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublised: true,
    };

    console.log("courseSubmittedFormData", courseSubmittedFormData);

    const response = await addNewCourseService(courseSubmittedFormData);
    if (response.status === "success") {
      toast({
        title: "Success",
        description: response.message,
        variant: "success",
      });
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      navigate(-1);
    }
  };

  useEffect(() => {
    console.log("currentEditedCourseId", currentEditedCourseId);
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  console.log(params, currentEditedCourseId, "params");

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create a new Course</h1>
        <Button
          disabled={!validateFormData()}
          onClick={handleOnSubmit}
          className="text-sm tracking-wider font-bold px-8"
        >
          Submit
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="setting">Setting</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="setting">
                <CourseSetting />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateNewCoursePage;
