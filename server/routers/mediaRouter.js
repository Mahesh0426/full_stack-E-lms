import express from "express";
import multer from "multer";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import {
  deleteMediaFromCloudinary,
  uploadMediaToCloudinary,
} from "../config/cloudibaryConfig.js";

const mediaRouter = express.Router();

const upload = multer({ dest: "uploads/" });

// POST | upload a file | create
mediaRouter.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Check if the file exists
    if (!req.file) {
      return buildErrorResponse(res, "No file provided", 400);
    }
    // Upload the file to Cloudinary
    const result = await uploadMediaToCloudinary(req.file.path);
    buildSuccessResponse(res, result, "file uploaded successfully");
  } catch (error) {
    console.error(error);

    buildErrorResponse(res, "error uploading  file");
  }
});
mediaRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return buildErrorResponse(res, "No id provided");
    }

    const result = await deleteMediaFromCloudinary(id);

    if (result) {
      return buildSuccessResponse(res, result, "file deleted successfully");
    }
  } catch (e) {
    console.log(e);

    buildErrorResponse(res, "Error deleting file", 500);
  }
});

mediaRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", id);

    if (!id) {
      return buildErrorResponse(res, "ID is required");
    }

    // Delete media from Cloudinary
    const cloudinaryResult = await deleteMediaFromCloudinary(id);
    if (cloudinaryResult) {
      // Now delete the media from the database using the id (or another field like publicId)
      const dbResult = await findOneAndDelete({ publicId: id }); // Assuming you store publicId in the database

      if (!dbResult) {
        return buildErrorResponse(res, "Media not found in the database");
      }

      // Respond with success if both Cloudinary and DB deletions were successful
      return buildSuccessResponse(
        res,
        { cloudinaryResult, dbResult },
        "File deleted successfully from both Cloudinary and database"
      );
    } else {
      return buildErrorResponse(res, "File not found in Cloudinary");
    }
  } catch (error) {
    console.log("Error deleting file:", error);
    return buildErrorResponse(res, "Error deleting file");
  }
});

// POST  |  bulk  upload request
mediaRouter.post(
  "/bulk-upload",
  upload.array("files", 10),
  async (req, res) => {
    // Check if the file exists
    if (!req.files) {
      return buildErrorResponse(res, "No file provided");
    }

    try {
      const uploadPromises = req.files.map((fileItem) =>
        uploadMediaToCloudinary(fileItem.path)
      );

      const result = await Promise.all(uploadPromises);

      buildSuccessResponse(res, result, "Files uploaded successfully");
    } catch (error) {
      console.log("Error deleting file:", error);
      buildErrorResponse(res, "Error in bulk uploading files");
    }
  }
);

export default mediaRouter;
