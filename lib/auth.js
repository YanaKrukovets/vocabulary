import jwt from "jsonwebtoken";

export function verifyToken(token) {
  if (!token) {
    throw new Error("Token is required");
  }

  try {
    // Verify the token using the JWT_SECRET from the environment variables
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
