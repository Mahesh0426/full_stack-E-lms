import MediaProgressBar from "@/components/media-progress-bar/MediaProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-Player/VideoPlayer";
import { courseCurriculumInitialFormData } from "@/config/signUpFormControls";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaDeleteService,
  mediaUploadService,
} from "@/services/registerService";
import React, { useContext } from "react";

const CourseCurriculum = () => {
  //get data from instrictor context

  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    isMediaUploadProgress,
    setIsMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  //validate courseCurriculumFormDaa
  const isCourseCurriculumFormDataValid = () => {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  };

  //function to handle new course
  const handleNewLecture = () => {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  };

  //function to handle course change
  const handleCourseChange = (e, currentIndex) => {
    const copyCurriculumFormData = [...courseCurriculumFormData];
    copyCurriculumFormData[currentIndex] = {
      ...copyCurriculumFormData[currentIndex],
      title: e.target.value,
    };

    setCourseCurriculumFormData(copyCurriculumFormData);
    // console.log("handleCourseChange:", copyCurriculumFormData);
  };

  //function to handle free preview change
  const handleFreePreviewChange = (currentValue, currentIndex) => {
    const copyCurriculumFormData = [...courseCurriculumFormData];

    copyCurriculumFormData[currentIndex] = {
      ...copyCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };

    setCourseCurriculumFormData(copyCurriculumFormData);
    // console.log("handleFreePreviewChange:", copyCurriculumFormData);
  };

  //  function to handle replace video
  const handleReplaceVideo = async (currentIndex) => {
    const copyCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      copyCurriculumFormData[currentIndex].public_id;

    const response = await mediaDeleteService(getCurrentVideoPublicId);
    console.log("deleted", response);
    if (response.status === "success") {
      copyCurriculumFormData[currentIndex] = {
        ...copyCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };
      setCourseCurriculumFormData(copyCurriculumFormData);
    }
  };

  // function to handle Single Lecture Upload
  const handleSingleLectureUpload = async (e, currentIndex) => {
    // console.log("handleSingleLectureUpload", e.target.files);

    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setIsMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.status === "success") {
          const copyCurriculumFormData = [...courseCurriculumFormData];
          copyCurriculumFormData[currentIndex] = {
            ...copyCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(copyCurriculumFormData);
          setIsMediaUploadProgress(false);
        }
        // console.log("response:", response);
      } catch (error) {
        console.log(error);
      }
    }
  };
  // console.log("courseCurriculumFormData:", courseCurriculumFormData);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Create Course Curriculum</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            disabled={
              !isCourseCurriculumFormDataValid() || isMediaUploadProgress
            }
            onClick={handleNewLecture}
          >
            Add Lecture
          </Button>

          {/* progress bar */}
          {isMediaUploadProgress ? (
            <MediaProgressBar
              isMediaUploading={isMediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          ) : null}

          <div className="mt-4">
            {courseCurriculumFormData.map((curriculumItem, index) => (
              <div key={index} className="border p-5 rounded-md mb-4">
                <div className="flex gap-5">
                  <h3 className="font-semibold">Lecture {index + 1}</h3>
                  <Input
                    name={`title ${index + 1}`}
                    placeholder="Enter lecture title"
                    className="max-w-96"
                    onChange={(e) => {
                      handleCourseChange(e, index);
                    }}
                    value={courseCurriculumFormData[index]?.title}
                  />
                  <div className="flex-item-center space-x-2">
                    <Switch
                      onCheckedChange={(value) => {
                        handleFreePreviewChange(value, index);
                      }}
                      checked={courseCurriculumFormData[index]?.freePreview}
                      id={`freePreview ${index + 1}`}
                    />
                    <Label htmlFor={`freePreview ${index + 1}`}>
                      Free Preview
                    </Label>
                  </div>
                </div>
                <div className="mt-6">
                  {courseCurriculumFormData[index]?.videoUrl ? (
                    <div className="flex gap-3">
                      <VideoPlayer
                        url={courseCurriculumFormData[index]?.videoUrl}
                        width="450px"
                        height="200px"
                      />
                      <Button onClick={() => handleReplaceVideo(index)}>
                        Replace Video
                      </Button>
                      <Button className="bg-red-900">Delete Lecture</Button>
                    </div>
                  ) : (
                    <Input
                      type="file"
                      accept="video/*"
                      className="mb-4"
                      onChange={(e) => {
                        handleSingleLectureUpload(e, index);
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseCurriculum;
