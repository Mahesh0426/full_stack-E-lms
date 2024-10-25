import MediaProgressBar from "@/components/media-progress-bar/MediaProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-Player/VideoPlayer";
import { courseCurriculumInitialFormData } from "@/config/signUpFormControls";
import { InstructorContext } from "@/context/instructor-context";
import { useToast } from "@/hooks/use-toast";

import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services/registerService";
import { Upload } from "lucide-react";
import React, { useContext, useRef } from "react";

const CourseCurriculum = () => {
  const { toast } = useToast();
  //get data from instrictor context
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    isMediaUploadProgress,
    setIsMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

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

    try {
      // Step 1: Delete the existing video
      const response = await mediaDeleteService(getCurrentVideoPublicId);
      if (response.status === "success") {
        toast({
          title: "Success",
          description: response.message || "file deleted successfully !!",
          variant: "success",
        });

        // Step 2: Reset video data
        copyCurriculumFormData[currentIndex] = {
          ...copyCurriculumFormData[currentIndex],
          videoUrl: "",
          public_id: "",
        };
        setCourseCurriculumFormData(copyCurriculumFormData);

        // Step 3: Allow user to upload a new video after deletion
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // function to handle course deletion
  async function handleDeleteLecture(currentIndex) {
    let copyCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoPublicId =
      copyCurriculumFormData[currentIndex].public_id;

    try {
      const response = await mediaDeleteService(
        getCurrentSelectedVideoPublicId
      );

      if (response.status === "success") {
        // Provide user feedback on successful deletion
        toast({
          title: "Success",
          description: "Lecture deleted successfully.",
          variant: "success",
        });

        // Remove the lecture from the form data
        copyCurriculumFormData = copyCurriculumFormData.filter(
          (_, index) => index !== currentIndex
        );

        setCourseCurriculumFormData(copyCurriculumFormData);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete the lecture.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  // Helper function checking if a single object is empty
  const isCurriculumDataEmpty = (data) => {
    return Object.entries(data).every(([key, value]) => {
      return typeof value === "boolean" || value === "";
    });
  };

  // Check if all curriculum entries in the array are empty
  const areAllCurriculumEntriesEmpty = (curriculumDataArray) => {
    return curriculumDataArray.every(isCurriculumDataEmpty);
  };
  // Create FormData for bulk media upload
  const createFormData = (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return formData;
  };

  // Update curriculum data with newly uploaded files
  const UpdateCurriculumFormDataWithUploadedFiles = (
    uploadedFiles,
    existingCurriculum
  ) => {
    const newEntries = uploadedFiles.map((file, index) => ({
      videoUrl: file.url,
      public_id: file.public_id,
      title: `Lecture ${existingCurriculum.length + index + 1}`,
      freePreview: false,
    }));
    return [...existingCurriculum, ...newEntries];
  };

  // Function to handle file selection and bulk upload
  const handleMediaBulkUpload = async (e) => {
    // Convert FileList to Array and create FormData with selected files
    const selectedFiles = Array.from(e.target.files);
    const bulkFormData = createFormData(selectedFiles);

    try {
      setIsMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );
      if (response.status === "success") {
        // Check if curriculum form data is empty
        let copyCurriculumFormData = areAllCurriculumEntriesEmpty(
          courseCurriculumFormData
        )
          ? [] // If empty, start with an empty array
          : [...courseCurriculumFormData]; // Otherwise, copy existing data

        // Update curriculum with new uploaded files
        copyCurriculumFormData = UpdateCurriculumFormDataWithUploadedFiles(
          response.data,
          copyCurriculumFormData
        );

        setCourseCurriculumFormData(copyCurriculumFormData);
        setIsMediaUploadProgress(false);
      }
    } catch (error) {
      console.log(error);
    }

    // console.log(selectedFiles);
  };

  // function to handle onCLick to upload in  bulk
  const handleOpenBulkUploadDialog = () => {
    bulkUploadInputRef.current?.click();
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Create Course Curriculum</CardTitle>
          <div>
            <Input
              className="hidden"
              id="bulk-media-upload"
              type="file"
              accept="video/*"
              multiple
              ref={bulkUploadInputRef}
              onChange={handleMediaBulkUpload}
            />
            <Button
              as="label"
              htmlFor="bulk-media-upload"
              variant="outline"
              className="cursor-pointer"
              onClick={handleOpenBulkUploadDialog}
            >
              <Upload className="w-4 h-5 mr-2" />
              Bulk Upload
            </Button>
          </div>
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
                      <Button
                        onClick={() => handleDeleteLecture(index)}
                        className="bg-red-900"
                      >
                        Delete Lecture
                      </Button>
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
