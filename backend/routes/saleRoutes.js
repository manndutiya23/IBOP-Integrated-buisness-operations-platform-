import express from "express";

import {
  createSale,
  deleteSale,
  getSales,
} from "../controllers/saleController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles(
    "Admin",
    "Sales",
    "Management"
  ),
  createSale
);

router.get(
  "/",
  protect,
  authorizeRoles(
    "Admin",
    "Sales",
    "Management"
  ),
  getSales
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  deleteSale
);

export default router;