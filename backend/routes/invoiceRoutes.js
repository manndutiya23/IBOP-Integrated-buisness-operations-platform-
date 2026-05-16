import express from "express";

import {
  createInvoice,
  getInvoices,
  updateInvoiceStatus,
} from "../controllers/invoiceController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("Admin", "Finance", "Sales", "Management"),
  createInvoice
);

router.get(
  "/",
  protect,
  authorizeRoles(
    "Admin",
    "Finance",
    "Management"
  ),
  getInvoices
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("Admin", "Finance", "Management"),
  updateInvoiceStatus
);

export default router;