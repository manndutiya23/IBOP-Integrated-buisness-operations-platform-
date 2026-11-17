import express from "express";
import {
  createProductCatalogueEntry,
  deleteProductCatalogueEntry,
  getProductCatalogue,
} from "../controllers/productCatalogueController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("Admin", "Supply Chain", "Management"), getProductCatalogue);
router.post("/", protect, authorizeRoles("Admin", "Supply Chain"), createProductCatalogueEntry);
router.delete("/:id", protect, authorizeRoles("Admin", "Supply Chain"), deleteProductCatalogueEntry);

export default router;
