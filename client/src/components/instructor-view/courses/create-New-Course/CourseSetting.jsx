import MediaProgressBar from "@/components/media-progress-bar/MediaProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services/registerService";
import React, { useContext } from "react";

const CourseSetting = () => {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    isMediaUploadProgress,
    setIsMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  // function to handle image upload change events
  const handleImageUploadChange = async (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setIsMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.status === "success") {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
        }
        setIsMediaUploadProgress(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // console.log("courseLandingFornData:", courseLandingFormData);
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Course Setting</CardTitle>
        </CardHeader>

        {/* progress bar */}
        {isMediaUploadProgress ? (
          <MediaProgressBar
            isMediaUploading={isMediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}

        <CardContent>
          {courseLandingFormData?.image ? (
            <img
              src={courseLandingFormData.image}
              alt="Course Image"
              className="w-full h-auto object-cover rounded-md"
            />
          ) : (
            <div className="flex flex-col gap-3">
              <Label>Upload Course Thumnail</Label>
              <Input
                type="file"
                accept="image/*"
                className="mb-4"
                onChange={handleImageUploadChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseSetting;
