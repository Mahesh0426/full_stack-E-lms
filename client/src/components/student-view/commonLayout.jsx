import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./header";

const StudentViewCommonLayout = () => {
  const location = useLocation();
  return (
    <div>
      {!location.pathname.includes("course-progress") ? <Header /> : null}

      <Outlet />
    </div>
  );
};

export default StudentViewCommonLayout;
