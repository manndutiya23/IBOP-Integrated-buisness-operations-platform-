import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";


// PROTECT ROUTES
export const protect = async (req, res, next) => {

  try {

    let token;

    // check authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];
    }

    // no token
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // attach employee to request
    req.employee = await Employee.findById(
      decoded.id
    ).select("-password");

    next();

  } catch (error) {

    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error
    );

    res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};


// ROLE AUTHORIZATION
export const authorizeRoles = (...roles) => {

  return (req, res, next) => {

    if (!roles.includes(req.employee.role)) {

      return res.status(403).json({
        message:
          "Access denied: insufficient permissions",
      });
    }

    next();
  };
};