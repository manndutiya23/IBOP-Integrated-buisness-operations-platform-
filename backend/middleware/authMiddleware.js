import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Employee from "../models/Employee.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized. Please log in." });
  }
  const token = authHeader.slice(7).trim();
  if (!token) return res.status(401).json({ message: "Not authorized. Please log in." });
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured.");
    return res.status(500).json({ message: "Authentication service is unavailable." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || typeof decoded !== "object" || !mongoose.isValidObjectId(decoded.id)) {
      return res.status(401).json({ message: "Not authorized. Invalid token." });
    }
    const employee = await Employee.findById(decoded.id).select("-password");
    if (!employee || employee.isActive === false) {
      return res.status(401).json({ message: "Your account is unavailable. Please contact an administrator." });
    }
    req.employee = employee;
    return next();
  } catch (error) {
    if (["TokenExpiredError", "JsonWebTokenError", "NotBeforeError"].includes(error.name)) {
      return res.status(401).json({ message: "Your session is invalid or has expired. Please log in again." });
    }
    console.error("Authentication lookup failed:", error.message);
    return res.status(500).json({ message: "Authentication could not be completed." });
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.employee) return res.status(401).json({ message: "Not authorized. Please log in." });
  if (!roles.includes(req.employee.role)) {
    return res.status(403).json({ message: "Access denied: insufficient permissions." });
  }
  return next();
};
