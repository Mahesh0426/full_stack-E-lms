import { Fragment } from "react";
import { Navigate, useLocation } from "react-router-dom";

const RouteGuard = (authenticated, user, element) => {
  const location = useLocation();

  //Check if User is Not Authenticated
  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to={"/auth"} />;
  }
  //Check if User is Authenticated but Not Admin
  if (
    authenticated &&
    user?.role !== "admin" &&
    (location.pathname.includes("admin") || location.pathname.includes("/auth"))
  ) {
    return <Navigate to={"/home"} />;
  }
  // Check if User is Admin but Not on Admin Route
  if (
    authenticated &&
    user.role == "admin" &&
    !location.pathname.includes("admin")
  ) {
    return <Navigate to={"/admin"} />;
  }
  return <Fragment>{element}</Fragment>;
};

export default RouteGuard;
