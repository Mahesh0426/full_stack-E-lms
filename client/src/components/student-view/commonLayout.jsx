import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";

const StudentViewCommonLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default StudentViewCommonLayout;
