import FormControl from "@/components/common-form/form-control";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config/signUpFormControls";
import { InstructorContext } from "@/context/instructor-context";
import React, { useContext } from "react";

const CourseLanding = () => {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Course Landing Page</CardTitle>
        </CardHeader>
        <CardContent>
          <FormControl
            formControls={courseLandingPageFormControls}
            formData={courseLandingFormData}
            setFormData={setCourseLandingFormData}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseLanding;
