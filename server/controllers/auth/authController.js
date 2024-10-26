import User from "../../models/userSchema.js";
import { comparePassword, hashPassword } from "../../utility/bcryptHelper.js";
import { generateAccessJWT } from "../../utility/jwtHelper.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../../utility/responseHelper.js";

// Register a new user | SIGN IN | POST | Public Route
const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  // Check if the user already exists
  const existUser = await User.findOne({ $or: [{ userEmail }, { userName }] });

  if (existUser) {
    return buildErrorResponse(res, "User already exists");
  }

  //hasing password
  const encryptedPassword = hashPassword(password);

  // Create and save the new user in db
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

// login a registered user | LOG IN | POST request | Public route
const loginUser = async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    // Find user by email
    const checkUser = await User.findOne({ userEmail });

    // Check if user exists
    if (!checkUser) {
      return buildErrorResponse(res, "User account does not exist!!");
    }

    // Compare the password
    const isPasswordMatch = comparePassword(password, checkUser.password);
    if (isPasswordMatch) {
      // Generate and send back the access token and user data
      const accessToken = generateAccessJWT(
        checkUser.userEmail,
        checkUser.role,
        checkUser._id,
        checkUser.userName
      );
      return buildSuccessResponse(
        res,
        {
          accessToken,
          user: {
            _id: checkUser._id,
            email: checkUser.userEmail,
            role: checkUser.role,
            userName: checkUser.userName,
          },
        },
        "Logged in successfully!!"
      );
    }

    return buildErrorResponse(res, "Invalid credentials!!");
  } catch (error) {
    console.error("Login error:", error);
    return buildErrorResponse(
      res,
      "An unexpected error occurred. Please try again later."
    );
  }
};

export { registerUser, loginUser };
