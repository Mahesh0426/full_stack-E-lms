import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/authPage/AuthPage";
import RouteGuard from "./components/route-Guard/protectedRoute";
import { useContext } from "react";
import { AuthContext } from "./context/authContect";
import InstructorDashboardPage from "./pages/Instructor/InstructorDashboardPage";
import StudentViewCommonLayout from "./components/student-view/commonLayout";
import StudentHomePage from "./pages/Student/homePage";
import PageNotFound from "./pages/not-foundPage/notFoundPage";
import CreateNewCoursePage from "./pages/Instructor/CreateNewCoursePage";
import { Toaster } from "./components/ui/toaster";
import StudentViewCoursePage from "./pages/Student/CoursePage";
import StudentViewCourseDetailsPage from "./pages/Student/CourseDetailsPage";
import PaypalPaymentReturnPage from "./pages/Student/paymentReturnPage";
import MyCoursesPage from "./pages/Student/myCoursesPage";
import CourseProgressPage from "./pages/Student/CourseProgressPage";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={
            <RouteGuard
              element={<AuthPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor"
          element={
            <RouteGuard
              element={<InstructorDashboardPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/create-new-course"
          element={
            <RouteGuard
              element={<CreateNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/edit-course/:courseId"
          element={
            <RouteGuard
              element={<CreateNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/"
          element={
            <RouteGuard
              element={<StudentViewCommonLayout />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        >
          <Route path="home" element={<StudentHomePage />} />
          <Route path="" element={<StudentHomePage />} />
          <Route path="courses" element={<StudentViewCoursePage />} />
          <Route
            path="course/details/:id"
            element={<StudentViewCourseDetailsPage />}
          />
          <Route path="payment-return" element={<PaypalPaymentReturnPage />} />
          <Route path="student-courses" element={<MyCoursesPage />} />
          <Route path="course-progress/:id" element={<CourseProgressPage />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
