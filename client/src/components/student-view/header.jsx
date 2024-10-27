import { GraduationCap, TvMinimalPlay } from "lucide-react";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { AuthContext } from "@/context/authContect";
import { toast } from "@/hooks/use-toast";

const Header = () => {
  const { handleResetCredentials } = useContext(AuthContext);

  const navigate = useNavigate();

  //function to handle logout
  const handleLogout = () => {
    handleResetCredentials();
    sessionStorage.clear();
    toast({
      title: "Success",
      description: "bye bye see you again!!",
      variant: "success",
    });
  };
  return (
    <header className=" flex items-center justify-between p-4 border-b relative">
      {/* left side */}
      <div className="flex items-center space-x-4">
        <Link to="/home" className="flex items-center hover:text-black">
          <GraduationCap className="h-6 w-8 mr-4 hover:text-balck" />
          <span className="font-extrabold md:text-xl text-[14px]">LearnX</span>
        </Link>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost
            "
            className="text-[14px] md:text-[16px] font-medium"
            onClick={() => navigate("/courses")}
          >
            Explore Courses
          </Button>
        </div>
      </div>

      {/* right side */}
      <div className="flex items-center space-x-4">
        <div className="flex gap-4 items-center">
          <div className="flex cursor-pointer items-center gap-3">
            {" "}
            <span className="font-extrabold md:text-xl text-[14px]">
              My Courses
            </span>
            <TvMinimalPlay className="w-8 h-8 cursor-pointer" />
          </div>
          <Button onClick={handleLogout}> Sign Out</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
