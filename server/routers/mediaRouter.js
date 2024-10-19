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

    buildErrorResponse(res, "error uploading  file", 500);
  }
});

//  DELETE| delete the uploaded file
mediaRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      buildErrorResponse(res, "ID is required");
    }

    const result = await deleteMediaFromCloudinary(id);
    if (result) {
      buildSuccessResponse(res, result, "File deleted successfully");
    } else {
      buildErrorResponse(res, "File not found", 404);
    }
  } catch (error) {
    console.log("Error deleting file:", error);
    buildErrorResponse(res, "Error deleting file", 500);
  }
});

export default mediaRouter;
