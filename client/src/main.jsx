import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/authContect.jsx";
import InstructorProvider from "./context/instructor-context.jsx";
import StudentHomePage from "./pages/Student/homePage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <InstructorProvider>
          <StudentHomePage>
            <App />
          </StudentHomePage>
        </InstructorProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
