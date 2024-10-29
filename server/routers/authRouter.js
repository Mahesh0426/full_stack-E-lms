// @ts-nocheck
import express from "express";
import { loginUser, registerUser } from "../controllers/auth/authController.js";
import { authMiddleware } from "../middleware/authMiddleware/authMiddleware.js";
import { buildSuccessResponse } from "../utility/responseHelper.js";

const authRouter = express.Router();

// | SIGN IN | POST | Public Route
authRouter.post("/", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  console.log("req.user", req.user);

  buildSuccessResponse(res, user, "Authenticated User !!");
});

export default authRouter;
