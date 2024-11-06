import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-Player/VideoPlayer";
import { AuthContext } from "@/context/authContect";
import { StudentContext } from "@/context/studentContext";
import { toast } from "@/hooks/use-toast";
import useLoading from "@/hooks/useLoading";
import {
  checkCoursePurchaseInfoService,
  createPaymentService,
  fetchStudentViewCourseListDetailsService,
} from "@/services/registerService";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const StudentViewCourseDetailsPage = () => {
  const {
    studentViewCoursesDetails,
    setStudentViewCoursesDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  // State management for video preview and dialog
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");

  // Course ID from URL parameters and location
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  //function to fetch course details based on the current course ID.
  const fetchCourseDetails = async () => {
    if (!id) return;

    // call the `checkCoursePurchaseInfoService` to see if the course is already purchased
    const checkCoursePurchaseInfoResponse =
      await checkCoursePurchaseInfoService(id, auth?.user._id);

    if (
      checkCoursePurchaseInfoResponse?.success &&
      checkCoursePurchaseInfoResponse?.data
    ) {
      navigate(`/course-progress/${currentCourseDetailsId}`);
      return;
    }

    try {
      startLoading();
      const response = await fetchStudentViewCourseListDetailsService(id);

      if (response.status === "success") {
        setStudentViewCoursesDetails(response.data);
      } else {
        setStudentViewCoursesDetails(null);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      stopLoading();
    }
  };

  // function to handleSetFreePreview
  const handleSetFreePreview = (getCurrenVideoInfo) => {
    setDisplayCurrentVideoFreePreview(getCurrenVideoInfo?.videoUrl);
    // console.log("getCurrenVideoInfo", getCurrenVideoInfo);
  };

  // function to handleCreatePayment
  const handleCreatePayment = async () => {
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.email,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCoursesDetails?._id,
      instructorName: studentViewCoursesDetails?.instructorName,
      courseImage: studentViewCoursesDetails?.image,
      courseTitle: studentViewCoursesDetails?.title,
      courseId: studentViewCoursesDetails?._id,
      coursePricing: studentViewCoursesDetails?.pricing,
    };

    try {
      const response = await createPaymentService(paymentPayload);

      // Check and confirm if `approveUrl` is within `response.data`
      if (response?.status === "success" && response?.data?.approveUrl) {
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(response?.data?.orderId)
        );
        setApprovalUrl(response?.data?.approveUrl);
        // console.log("Approval URL:", response.data.approveUrl);
      } else {
        console.error(
          "Failed to get approval URL or invalid response structure:",
          response
        );
      }
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  // Fetch course details when ID changes
  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchCourseDetails();
  }, [currentCourseDetailsId]);

  // Update current course ID from URL params
  useEffect(() => {
    if (id) {
      setCurrentCourseDetailsId(id);
    }
  }, [id]);

  // Clear details when navigating away
  useEffect(() => {
    if (!location.pathname.includes("course/details"))
      setStudentViewCoursesDetails(null), setCurrentCourseDetailsId(null);
  }, [location.pathname]);

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) {
      setShowFreePreviewDialog(true);
    }
  }, [displayCurrentVideoFreePreview]);

  // Redirect after click on buy button
  if (approvalUrl) {
    window.location.href = approvalUrl;
  }

  // Find index of first free preview video
  const getIndexOfFreePreviewUrl =
    studentViewCoursesDetails !== null
      ? studentViewCoursesDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;

  if (isLoading) return <Skeleton />;

  return (
    <div className=" mx-auto p-4">
      {/* course  header ( subitle,title) */}
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {studentViewCoursesDetails?.title}
        </h1>
        <p className="text-xl mb-4">{studentViewCoursesDetails?.subtitle}</p>
        <div className="flex items-center space-x-4 mt-4 text-sm">
          <span>Created by {studentViewCoursesDetails?.instructorName}</span>
          <span>
            Created On {studentViewCoursesDetails?.date.split("T")[0]}
          </span>
          <span className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            {studentViewCoursesDetails?.primaryLanguage}
          </span>
          <span>
            {studentViewCoursesDetails?.students.length}
            {studentViewCoursesDetails?.students.length <= 1
              ? " Student"
              : " Students"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-8 mt-8 md:flex-row">
        <main className="flex-grow">
          {/* objective card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>what you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentViewCoursesDetails?.objectives
                  .split(",")
                  .map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          {/* course Description card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>{studentViewCoursesDetails?.description}</CardContent>
          </Card>

          {/* course content card  | Curriculum Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {studentViewCoursesDetails?.curriculum?.map(
                (curriculumItem, index) => (
                  <li
                    key={index}
                    className={`${
                      curriculumItem?.freePreview
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    } flex items-center mb-4`}
                    onClick={
                      curriculumItem?.freePreview
                        ? () => handleSetFreePreview(curriculumItem)
                        : null
                    }
                  >
                    {curriculumItem?.freePreview ? (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    <span>{curriculumItem?.title}</span>
                  </li>
                )
              )}
            </CardContent>
          </Card>
        </main>

        <aside className="w-full md:w-[500px]">
          {/* Video Player and Pricing Section */}
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentViewCoursesDetails?.curriculum[
                          getIndexOfFreePreviewUrl
                        ].videoUrl
                      : null
                  }
                  width="450px"
                  height="200px"
                />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  ${studentViewCoursesDetails?.pricing}
                </span>
              </div>
              <Button onClick={handleCreatePayment} className="w-full">
                Buy Now
              </Button>
            </CardContent>
          </Card>
        </aside>
        {/* dialogue modal section  */}
        <Dialog
          open={showFreePreviewDialog}
          onOpenChange={() => {
            setShowFreePreviewDialog(false);
            setDisplayCurrentVideoFreePreview(null);
          }}
        >
          <DialogContent className="w-[800px]">
            <DialogHeader>
              <DialogTitle>Course Preview</DialogTitle>
              <DialogDescription>
                Anyone who has this link will be able to view this.
              </DialogDescription>
            </DialogHeader>
            <div className="aspect-video rounded-lg flex items-center justify-center">
              <VideoPlayer
                url={displayCurrentVideoFreePreview}
                width="450px"
                height="200px"
              />
            </div>
            <div className="flex flex-col gap-2">
              {studentViewCoursesDetails?.curriculum
                ?.filter((item) => item.freePreview)
                .map((filteredItem) => (
                  <p
                    key={filteredItem._id}
                    onClick={() => handleSetFreePreview(filteredItem)}
                    className="cursor-pointer text-[16px] font-medium"
                  >
                    {filteredItem?.title}
                  </p>
                ))}
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentViewCourseDetailsPage;
