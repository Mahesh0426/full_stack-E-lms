import React, { useContext, useEffect, useState } from "react";
import CourseCurriculum from "@/components/instructor-view/courses/create-New-Course/CourseCurriculum";
import CourseLanding from "@/components/instructor-view/courses/create-New-Course/CourseLanding";
import CourseSetting from "@/components/instructor-view/courses/create-New-Course/CourseSetting";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InstructorContext } from "@/context/instructor-context";
import { AuthContext } from "@/context/authContect";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services/registerService";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config/signUpFormControls";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CreateNewCoursePage = () => {
  const { toast } = useToast();
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

  const [loading, setLoading] = useState(false);

  // Helper function to check if a value is empty
  const isEmpty = (value) =>
    Array.isArray(value) ? value.length === 0 : value === "" || value == null;

  const validateFormData = () => {
    const isCourseLandingFormDataValid = Object.values(
      courseLandingFormData
    ).every((value) => !isEmpty(value));

    if (!isCourseLandingFormDataValid) return false;

    const hasFreePreview = courseCurriculumFormData.some(
      (item) =>
        !isEmpty(item.title) &&
        !isEmpty(item.videoUrl) &&
        !isEmpty(item.public_id) &&
        item.freePreview
    );

    return hasFreePreview;
  };

  // function to  create or update a course
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

    try {
      const response =
        currentEditedCourseId !== null
          ? await updateCourseByIdService(
              currentEditedCourseId,
              courseSubmittedFormData
            )
          : await addNewCourseService(courseSubmittedFormData);

      if (response.status === "success") {
        toast({
          title: "Success",
          description: response.message,
          variant: "success",
        });
        navigate(-1);
        setCurrentEditedCourseId(null);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to submit the course.",
          variant: "destructive", // Assuming 'destructive' is your error variant
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  // function to fetch  current details
  const fetchCurrentCourseDetails = async (courseId) => {
    setLoading(true);
    try {
      const response = await fetchInstructorCourseDetailsService(courseId);
      if (response.status === "success") {
        updateFormDataWithCurrentDetails(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  //Helper function to update form data with current details
  const updateFormDataWithCurrentDetails = (data) => {
    const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce(
      (acc, key) => {
        acc[key] = data[key] || courseLandingInitialFormData[key];
        return acc;
      },
      {}
    );

    setCourseLandingFormData(setCourseFormData);
    setCourseCurriculumFormData(data.curriculum);
  };

  useEffect(() => {
    if (params?.courseId) {
      setCurrentEditedCourseId(params?.courseId);

      // Reset the form data before fetching new course details
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);

      // Fetch the new course details
      fetchCurrentCourseDetails(params?.courseId);
    }
  }, [params?.courseId]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">
          {currentEditedCourseId !== null
            ? "Edit a Course"
            : "Create a new Course"}
        </h1>
        <Button
          disabled={!validateFormData() || loading}
          onClick={handleOnSubmit}
          className="text-sm tracking-wider font-bold px-8"
        >
          {currentEditedCourseId !== null ? "Update" : "Submit"}
        </Button>
      </div>

      {loading ? (
        <p>Loading course details...</p> // Display a loader while fetching data
      ) : (
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
      )}
    </div>
  );
};

export default CreateNewCoursePage;
