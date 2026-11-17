import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustProductStock,
} from "../controllers/productController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("Admin", "Supply Chain", "Sales", "Management"), getProducts);

// Kept as a clear rejection for old clients; stock batches must originate from goods receipt.
router.post("/", protect, authorizeRoles("Admin", "Supply Chain"), createProduct);
router.post("/:id/adjust-stock", protect, authorizeRoles("Admin", "Supply Chain"), adjustProductStock);
router.put("/:id", protect, authorizeRoles("Admin", "Supply Chain"), updateProduct);
router.delete("/:id", protect, authorizeRoles("Admin"), deleteProduct);

export default router;
