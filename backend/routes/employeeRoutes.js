import express from "express";

import {
  createEmployee,
  getEmployees,
  deleteEmployee,
  loginEmployee
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/", createEmployee);

router.post("/login", loginEmployee);

router.get("/", getEmployees);

router.delete("/:id", deleteEmployee);

export default router;