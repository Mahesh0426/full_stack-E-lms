import { Fragment } from "react";
import { Navigate, useLocation } from "react-router-dom";
const RouteGuard = (props) => {
  const { element, authenticated, user } = props;
  const location = useLocation();

  //   console.log("Authenticated:", authenticated);
  //   console.log("User:", user);

  // Check if User is Not Authenticated
  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" />;
  }
  // Check if User is Authenticated but Not Instructor
  if (
    authenticated &&
    user?.role !== "instructor" &&
    (location.pathname.includes("instructor") ||
      location.pathname.includes("/auth"))
  ) {
    return <Navigate to="/home" />;
  }
  // Check if User is Instructor but Not on Instructor Route
  if (
    authenticated &&
    user?.role === "instructor" &&
    !location.pathname.includes("instructor")
  ) {
    return <Navigate to="/instructor" />;
  }
  return <Fragment>{element}</Fragment>;
};

export default RouteGuard;
