// @ts-nocheck
import express from "express";
import { loginUser, registerUser } from "../controllers/auth/authController.js";

const authRouter = express.Router();

// | SIGN IN | POST | Public Route
authRouter.post("/", registerUser);
authRouter.post("/login", loginUser);

export default authRouter;
