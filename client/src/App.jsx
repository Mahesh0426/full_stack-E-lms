import { Route, Routes } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/authPage/AuthPage";
import RouteGuard from "./components/route-Guard/protectedRoute";
import { useContext } from "react";
import { AuthContext } from "./context/authContect";
import AdminDashboard from "./pages/Instructor/adminDashboard";
import StudentViewCommonLayout from "./components/student-view/commonLayout";
import StudentHomePage from "./pages/Student/homePage";
import PageNotFound from "./pages/not-foundPage/notFoundPage";

function App() {
  const { auth } = useContext(AuthContext);

  return (
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
            element={<AdminDashboard />}
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
        <Route path="/home" element={<StudentHomePage />} />
        <Route path="/" element={<StudentHomePage />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
