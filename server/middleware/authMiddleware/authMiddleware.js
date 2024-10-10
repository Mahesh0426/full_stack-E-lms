import { verifyAccessJWT } from "../../controllers/auth/utility/jwtHelper.js";
import { buildErrorResponse } from "../../controllers/auth/utility/responseHelper.js";

// Middleware to authenticate the user by verifying JWT
export const authenticate = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Check if the authorization header exists
    if (!authorization) {
      return buildErrorResponse(res, "User is not authorized!!", 401);
    }

    // Extract the token from the Authorization header (Bearer <token>)
    const token = authorization.split(" ")[1];

    // Check if the token is provided
    if (!token) {
      return buildErrorResponse(res, "Authorization token missing", 401);
    }

    // Validate the access JWT and decode its payload to retrieve user information
    const decoded = verifyAccessJWT(token);

    // Attach the decoded payload to the request object
    req.user = decoded;

    // Proceed to the next middleware or route
    next();
  } catch (error) {
    return buildErrorResponse(res, "Invalid or expired token", 401);
  }
};
