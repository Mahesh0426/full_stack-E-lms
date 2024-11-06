import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-Player/VideoPlayer";
import { AuthContext } from "@/context/authContect";
import { StudentContext } from "@/context/studentContext";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services/registerService";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

import { useNavigate, useParams } from "react-router-dom";

const CourseProgressPage = () => {
  const { auth } = useContext(AuthContext);
  const { studentCurentCourseProgress, setStudentCurentCourseProgress } =
    useContext(StudentContext);

  const [isLockCourse, setIsLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  // function to fetch current course progress
  const fetchCurrentCourseProgress = async () => {
    try {
      const response = await getCurrentCourseProgressService(
        auth?.user?._id,
        id
      );
      if (response.status === "success") {
        if (!response?.data?.isPurchased) {
          setIsLockCourse(true);
        } else {
          setStudentCurentCourseProgress({
            courseDetails: response?.data?.courseDetails,
            progress: response?.data?.progress,
          });
          if (response?.data?.completed) {
            setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
            setShowCourseCompleteDialog(true);
            setShowConfetti(true);

            return;
          }
          if (response?.data?.progress?.length === 0) {
            setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          } else {
            // Use findLastIndex to find the last lecture that was viewed
            const lastIndexOfViewedAsTrue =
              response?.data?.progress.findLastIndex((obj) => obj.viewed);

            // If no lectures were viewed, lastIndexOfViewedAsTrue will be -1, so we start at index 0
            const nextLectureIndex = lastIndexOfViewedAsTrue + 1;

            // Set the current lecture to the next unwatched one
            setCurrentLecture(
              response?.data?.courseDetails?.curriculum[nextLectureIndex]
            );
          }
        }
      }
      // console.log("response", response);
    } catch (error) {
      console.log("internal error occure", error);
    }
  };

  // function to update course progress
  const updateCourseProgress = async () => {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.status === "success") {
        fetchCurrentCourseProgress();
      }
    }
  };

  // function to handleProgressUpdate
  const handleProgressUpdate = (updatedProgress) => {
    setCurrentLecture(updatedProgress);
  };

  // function to handle re-watch
  const handleRewatchCourse = async () => {
    try {
      const response = await resetCourseProgressService(
        auth?.user?._id,
        studentCurentCourseProgress?.courseDetails?._id
      );

      if (response?.status === "success") {
        setCurrentLecture(null);
        setShowConfetti(false);
        setShowCourseCompleteDialog(false);
        fetchCurrentCourseProgress();
      }
    } catch (error) {
      console.error("Failed to reset course progress:", error);
    }
  };

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 5000);
  }, [showConfetti]);

  return (
    <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
      {showConfetti && <ReactConfetti />}

      {/* header section  */}
      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => {
              navigate("/student-courses");
            }}
            className=" bg-white text-black"
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to my courses Page
          </Button>
          <h1 className="text-lg font-bold hidden md:block">
            {studentCurentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* video player section with side bar*/}
      <div className="flex flex-1 overflow-hidden">
        {/* video player section  */}
        <div
          className={`flex-1 ${
            isSideBarOpen ? "mr-[400px]" : ""
          } transition-all duration-300`}
        >
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl}
            onProgressUpdate={handleProgressUpdate}
            progressData={currentLecture}
          />
          <div className="p-6 bg-[#1c1d1f]">
            <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
          </div>
        </div>

        {/* side bar section  */}
        <div
          className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
              <TabsTrigger
                value="content"
                className=" bg-white text-black rounded-none h-full"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className=" bg-white text-black rounded-none h-full"
              >
                OverView
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {studentCurentCourseProgress?.courseDetails?.curriculum.map(
                    (item) => (
                      <div
                        key={item._id}
                        className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
                      >
                        {studentCurentCourseProgress?.progress?.find(
                          (progressItem) => progressItem.lectureId === item._id
                        )?.viewed ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Play className="h-4 w-4 " />
                        )}
                        <span>{item?.title}</span>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4">About this course</h2>
                  <p className="text-gray-400">
                    {studentCurentCourseProgress?.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Course dialogue 1  */}
      <Dialog open={isLockCourse}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>You can't view this page</DialogTitle>
            <DialogDescription>
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Course dialogue 2  */}
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent showOverlay={false} className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Label>You have completed the course</Label>
              <span className="flex flex-row gap-3">
                <Button onClick={() => navigate("/student-courses")}>
                  My Courses Page
                </Button>
                <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseProgressPage;
