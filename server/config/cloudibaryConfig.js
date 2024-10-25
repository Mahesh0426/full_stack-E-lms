import { v2 as cloudinary } from "cloudinary";

// Ensure the required environment variables are set
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(
    "Cloudinary configuration missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment."
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload a local file to Cloudinary and return the public URL
const uploadMediaToCloudinary = async (filepath) => {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Error while uploading media to Cloudinary.");
  }
};

// const deleteMediaFromCloudinary = async (publicId) => {
//   console.log("Deleting media with publicId:", publicId);

//   try {
//     // Attempt to delete the video from Cloudinary with the correct resource_type
//     const result = await cloudinary.uploader.destroy(publicId, {
//       resource_type: "video",
//     });

//     // Check the result from Cloudinary
//     if (result.result === "ok") {
//       return true;
//     } else {
//       // Log the specific result message for troubleshooting
//       console.error("Failed to delete media from Cloudinary:", result);
//       throw new Error(`Cloudinary deletion failed: ${result.result}`);
//     }
//   } catch (error) {
//     // Log the specific error message
//     console.error("Cloudinary deletion error:", error.message || error);
//     throw new Error("Error while deleting media from Cloudinary.");
//   }
// };
const deleteMediaFromCloudinary = async (publicId) => {
  console.log("Attempting to delete media with publicId:", publicId);

  try {
    // Attempt to delete the video from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video", // Ensure you're deleting a video
    });

    // Log the result for debugging
    console.log("Cloudinary deletion result:", result);

    // Check the result of the Cloudinary deletion
    if (result.result === "ok" || result.result === "deleted") {
      // Success case
      return true;
    } else if (result.result === "not found") {
      // Log media not found for debugging
      console.warn(
        `Media with publicId ${publicId} was not found in Cloudinary`
      );
      return false; // Return false to indicate failure
    } else {
      // Log any unexpected results for troubleshooting
      console.error("Unexpected Cloudinary deletion result:", result);
      throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }
  } catch (error) {
    // Log any errors that occur during deletion
    console.error("Cloudinary deletion error:", error.message || error);

    // Rethrow the error to be handled by the caller
    throw new Error("Error while deleting media from Cloudinary.");
  }
};

export { cloudinary, uploadMediaToCloudinary, deleteMediaFromCloudinary };
