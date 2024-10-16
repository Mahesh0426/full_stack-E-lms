import { verifyAccessJWT } from "../../utility/jwtHelper.js";
import { buildErrorResponse } from "../../utility/responseHelper.js";

// Middleware to authenticate the user by verifying JWT
export const authMiddleware = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Check if the authorization header exists
    if (!authorization) {
      return buildErrorResponse(res, "User is not authorized!!", 401);
    }

    // Extract the token from the Authorization header (Bearer <token>)
    const token = authorization.split(" ")[1];

    // Validate the access JWT and decode its payload to retrieve user information
    const payload = verifyAccessJWT(token);

    // Attach the decoded payload to the request object
    req.user = payload;

    // Proceed to the next middleware or route
    next();
  } catch (error) {
    return buildErrorResponse(res, "Invalid or expired token", 401);
  }
};
