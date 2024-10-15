import FormControl from "@/components/common-form/form-control";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config/signUpFormControls";
import { InstructorContext } from "@/context/instructor-context";
import React, { useContext } from "react";

const CourseLanding = () => {
  const { courseLandingFornData, setCourseLandingFornData } =
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
            formData={courseLandingFornData}
            setFormData={setCourseLandingFornData}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseLanding;
