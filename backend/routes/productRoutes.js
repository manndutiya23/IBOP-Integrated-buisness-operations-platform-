import express from "express";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  importProductCatalogue,
} from "../controllers/productController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("Admin", "Supply Chain", "Sales", "Management"),
  getProducts
);

router.post(
  "/import",
  protect,
  authorizeRoles("Admin", "Supply Chain"),
  importProductCatalogue
);

router.post(
  "/",
  protect,
  authorizeRoles("Admin", "Supply Chain"),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorizeRoles("Admin", "Supply Chain"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  deleteProduct
);

export default router;
