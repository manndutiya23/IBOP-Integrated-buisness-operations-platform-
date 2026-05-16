import express from "express";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles(
    "Admin",
    "Supply Chain",
    "Management"
  ),
  getProducts
);

router.post(
  "/",
  protect,
  authorizeRoles(
    "Admin",
    "Supply Chain",
    "Management"
  ),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorizeRoles(
    "Admin",
    "Supply Chain",
    "Management"
  ),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "Supply Chain", "Management"),
  deleteProduct
);

export default router;