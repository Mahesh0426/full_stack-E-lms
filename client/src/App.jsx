import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/authPage/AuthPage";
import RouteGuard from "./components/route-Guard/protectedRoute";
import { useContext } from "react";
import { AuthContext } from "./context/authContect";
import AdminDashboard from "./pages/Instructor/adminDashboard";
import StudentViewCommonLayout from "./components/student-view/commonLayout";
import StudentHomePage from "./pages/Student/homePage";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/auth"
        // element={
        //   <RouteGuard
        //     authenticated={auth?.Authenticated}
        //     user={auth?.user}
        //     element={<AuthPage />}
        //   />
        // }
        element={<AuthPage />}
      />
      {/* <Route
        path="/instructor"
        element={
          <RouteGuard
            authenticated={auth?.Authenticated}
            user={auth?.user}
            element={<AdminDashboard />}
          />
        }
      />
      <Route
        path="/student"
        element={
          <RouteGuard
            authenticated={auth?.Authenticated}
            user={auth?.user}
            element={<StudentViewCommonLayout />}
          />
        }
      >
        <Route path="home" element={<StudentHomePage />} />
        <Route path="" element={<StudentHomePage />} />
      </Route> */}
    </Routes>
  );
}

export default App;
