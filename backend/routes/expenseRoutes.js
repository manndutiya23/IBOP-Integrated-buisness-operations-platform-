import express from "express";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";
import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("Admin", "Finance", "Management"),
  createExpense
);

router.get(
  "/",
  protect,
  authorizeRoles("Admin", "Finance", "Management"),
  getExpenses
);
router.put(
  "/:id",
  protect,
  authorizeRoles("Admin", "Finance", "Management"),
  updateExpense
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "Finance", "Management"),
  deleteExpense
);

export default router;