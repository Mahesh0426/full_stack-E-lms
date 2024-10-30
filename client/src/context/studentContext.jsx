import { createContext, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const [studentViewCoursesDetails, setStudentViewCoursesDetails] =
    useState(null);
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);

  return (
    <StudentContext.Provider
      value={{
        studentViewCoursesList,
        setStudentViewCoursesList,
        studentViewCoursesDetails,
        setStudentViewCoursesDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
