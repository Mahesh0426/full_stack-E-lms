import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config/signUpFormControls";
import { createContext, useState } from "react";

export const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData
  );

  const [isMediaUploadProgress, setIsMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);

  return (
    <InstructorContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        isMediaUploadProgress,
        setIsMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}
