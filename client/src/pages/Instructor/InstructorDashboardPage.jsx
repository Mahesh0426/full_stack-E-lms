import InstructorCourses from "@/components/instructor-view/courses/InstructorCourses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/authContect";
import { InstructorContext } from "@/context/instructor-context";
import { useToast } from "@/hooks/use-toast";
import { fetchInstructorCourseListService } from "@/services/registerService";
import { BarChart, Book, LogOut } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";

const InstructorDashboardPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("courses");
  const { handleResetCredentials } = useContext(AuthContext);

  const { instructorCourseList, setInstructorCourseList } =
    useContext(InstructorContext);

  //  function  to get | fetch all the courses
  const fetchAllCourses = async () => {
    const response = await fetchInstructorCourseListService();

    if (response.status === "success") {
      setInstructorCourseList(response?.data);
    }
    // console.log("fetchAllCourses", response);
  };

  //use effect to fetch all courses
  useEffect(() => {
    fetchAllCourses();
  }, []);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard listOfCourses={instructorCourseList} />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourse={instructorCourseList} />,
    },
    {
      icon: LogOut,
      label: "LogOut",
      value: "logout",
      component: null,
    },
  ];

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
    <div className="flex  h-full min-h-screen bg-grey-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
          <nav>
            {menuItems.map((menuItem) => (
              <Button
                key={menuItem.value}
                className="w-full justify-start mb-2"
                variant={activeTab === menuItem.value ? "secondary" : "ghost"}
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
              >
                <menuItem.icon className="mr-2 h-4 w-4" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent key={menuItem.value} value={menuItem.value}>
                {menuItem.component !== null ? menuItem.component : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboardPage;
