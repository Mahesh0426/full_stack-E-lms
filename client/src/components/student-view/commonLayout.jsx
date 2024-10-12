import React from "react";
import { Outlet } from "react-router-dom";

const StudentViewCommonLayout = () => {
  return (
    <div>
      common content
      <Outlet />
    </div>
  );
};

export default StudentViewCommonLayout;
