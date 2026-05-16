import express from "express";

import {
  createEmployee,
  getEmployees,
  deleteEmployee,
  loginEmployee
} from "../controllers/employeeController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();



router.post("/login", loginEmployee);
router.post(
  "/",
  protect,
  authorizeRoles("Admin", "HR"),
  createEmployee
);

router.get(
  "/",
  protect,
  authorizeRoles("Admin", "HR"),
  getEmployees
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  deleteEmployee
);

export default router;