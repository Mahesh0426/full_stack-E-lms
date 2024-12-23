import jwt from "jsonwebtoken";

// replace secret keys with JWT_ACCESS_SECRET for access JWT
// replace secret keys with JWT_REFRESH_SECRET for access JWT
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

// access jwt: session table, exp:15min
export const generateAccessJWT = (userEmail, userRole, _id, userName) => {
  return jwt.sign(
    { email: userEmail, role: userRole, _id, userName },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "200m",
    }
  );
};

// verify access token and return decoded email
export const verifyAccessJWT = (accessJWT) => {
  return jwt.verify(accessJWT, process.env.JWT_ACCESS_SECRET);
};
