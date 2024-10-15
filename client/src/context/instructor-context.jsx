import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config/signUpFormControls";
import { createContext, useState } from "react";

export const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {
  const [courseLandingFornData, setCourseLandingFornData] = useState(
    courseLandingInitialFormData
  );
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData
  );

  return (
    <InstructorContext.Provider
      value={{
        courseLandingFornData,
        setCourseLandingFornData,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}
