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

// Delete a local file from Cloudinary
const deleteMediaFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video", // Specify the resource type
    });
    if (result.result === "ok") {
      return true;
    } else {
      throw new Error("Failed to delete media from Cloudinary.");
    }
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    throw new Error("Error while deleting media from Cloudinary.");
  }
};

export { cloudinary, uploadMediaToCloudinary, deleteMediaFromCloudinary };
