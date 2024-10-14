import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/authContect";
import React, { useContext } from "react";

const StudentHomePage = () => {
  const { handleResetCredentials } = useContext(AuthContext);

  //function to handle logout
  const handleLogout = () => {
    handleResetCredentials();
    sessionStorage.clear();
  };
  return (
    <div>
      <h1>StudentHomePage</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default StudentHomePage;
