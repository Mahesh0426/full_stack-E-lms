import User from "../../models/userSchema.js";
import { hashPassword } from "./utility/bcryptHelper.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "./utility/responseHelper.js";

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  // Check if the user already exists
  const existUser = await User.findOne({ $or: [{ userEmail }, { userName }] });

  if (existUser) {
    return buildErrorResponse(res, "User already exists");
  }

  //hasing password
  const encryptedPassword = hashPassword(password);

  // Create and save the new user
  try {
    const newUser = new User({
      userName,
      userEmail,
      password: encryptedPassword,
      role,
    });

    await newUser.save();

    return buildSuccessResponse(res, newUser, "User registered successfully!");
  } catch (error) {
    console.error("Error during user registration:", error);
    return buildErrorResponse(res, "Error registering user");
  }
};

export default registerUser;
