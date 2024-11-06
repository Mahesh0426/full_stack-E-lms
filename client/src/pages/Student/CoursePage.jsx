import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { filterOptions, sortOptions } from "@/config/signUpFormControls";
import { AuthContext } from "@/context/authContect";
import { StudentContext } from "@/context/studentContext";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services/registerService";
import { ArrowUpDownIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// helper funtion to create search  params
const createSearchParamsHelper = (filterParams) => {
  const queryParams = [];

  // Iterate over each key-value pair in the filters object
  Object.entries(filterParams).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      // Join the array values into a comma-separated string and encode it
      const paramValue = encodeURIComponent(value.join(","));
      queryParams.push(`${key}=${paramValue}`);
    }
  });

  // Join the query parameters array with '&' to form the query string
  return queryParams.join("&");
};

const StudentViewCoursePage = () => {
  const [sort, setSort] = useState("price-lowtohigh");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  //get from Student Context
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();

  // function to handle filter change
  const handleFilterOnChange = (sectionName, selectedOption) => {
    // Create a copy of the current selectedFilters state
    let updatedFilterSelections = { ...selectedFilters };

    // Check if the current section (e.g., category, level, language) already exists in filters
    const sectionExists = updatedFilterSelections[sectionName];

    if (!sectionExists) {
      // If the section does not exist, add the selected option
      updatedFilterSelections[sectionName] = [selectedOption.id];
    } else {
      // Toggle filter selection
      const isOptionAlreadySelected = sectionExists.includes(selectedOption.id)
        ? sectionExists.filter((optionId) => optionId !== selectedOption.id) // Uncheck: remove the option
        : [...sectionExists, selectedOption.id]; // Check: add the option

      // If there are no options left in the section, remove the section from the filters
      if (isOptionAlreadySelected.length === 0) {
        delete updatedFilterSelections[sectionName];
      } else {
        updatedFilterSelections[sectionName] = isOptionAlreadySelected;
      }
    }
    // Update filters state and save the updated filters in session storage
    setSelectedFilters(updatedFilterSelections);
    sessionStorage.setItem("filters", JSON.stringify(updatedFilterSelections));
  };

  // function to fetch  student courses
  const fetchStudentsViewCourses = async (selectedFilters, sort) => {
    const query = new URLSearchParams({
      ...selectedFilters,
      sortBy: sort,
    });
    const response = await fetchStudentViewCourseListService(query);

    // console.log("response", response);
    if (response?.status === "success") {
      setStudentViewCoursesList(response.data);
      return;
    }
  };

  // function to  handle course navigation
  const handleCourseNavigate = async (getCurrentCourseId) => {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );
    if (response.status === "success") {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
    // console.log("response", response);
  };

  // updates the URL query parameters whenever the filters change.
  useEffect(() => {
    const buildQueryStringForFilters =
      createSearchParamsHelper(selectedFilters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [selectedFilters]);

  // useeffect to fetch all the courses whenever the filters or sorting change
  useEffect(() => {
    if (selectedFilters !== null && sort !== null)
      fetchStudentsViewCourses(selectedFilters, sort);
  }, [selectedFilters, sort]);

  // useeffect to load filters from session storage when component mounts
  useEffect(() => {
    setSort("price-lowtohigh");
    setSelectedFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  // remove filters from session storage when component unmounts
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">
        {/*  aside section with Filters sidebar */}
        <aside className="w-full space-y-4 md:w-64">
          <div>
            {/* filters sidebars */}
            {Object.keys(filterOptions).map((keyItem) => (
              <div key={keyItem} className="p-4 space-y-4">
                <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                <div className="grid gap-2 mt-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label
                      key={option.id}
                      className="flex font-medium items-center gap-3"
                    >
                      <Checkbox
                        checked={
                          selectedFilters[keyItem]?.includes(option.id) || false
                        }
                        onCheckedChange={() =>
                          handleFilterOnChange(keyItem, option)
                        }
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* main conent */}
        <main className="flex-1">
          {/* Course sorting */}
          <div className="flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-5"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="font-medium text-[16px]">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => {
                    setSort(value);
                  }}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm font-bold text-black">
              {studentViewCoursesList.length} Results
            </span>
          </div>

          {/* Course listing */}
          <div className="space-y-4">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card
                  key={courseItem?._id}
                  className="cursor-pointer transition-all duration-300 ease-in hover:shadow-lg hover:scale-101"
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                >
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={courseItem?.image}
                        alt="course image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {courseItem?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-1 font-bold">
                        {courseItem?.userName}
                      </p>
                      <p className="text-black mb-2 mt-3 text-[16px]">
                        {`${courseItem?.curriculum?.length} ${
                          courseItem?.curriculum?.length <= 1
                            ? "Lecture"
                            : "Lectures"
                        } - ${courseItem?.level.toUpperCase()} Level`}
                      </p>
                      <p className="font-bold text-lg">
                        ${courseItem?.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <h1 className="font-extrabold text-4xl">
                NO courses available at Momement
              </h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentViewCoursePage;
