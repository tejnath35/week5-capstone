import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (...allowedRoles) => async (req, res, next) => {
  try {
    // read token from cookies
    let token = req.cookies.token;
    console.log("token:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized request. Please login." });
    }

    // verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // role check
    if (allowedRoles.length && !allowedRoles.includes(decodedToken.role)) {
      return res.status(403).json({ message: "Forbidden. You are not allowed." });
    }

    // attach user to request
    req.user = decodedToken;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please login again." });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token, please login again." });
    }

    next(err);
  }
};