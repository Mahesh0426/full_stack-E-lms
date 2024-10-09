// @ts-nocheck
import express from "express";
import registerUser from "../controllers/auth/authController.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);

export default authRouter;
