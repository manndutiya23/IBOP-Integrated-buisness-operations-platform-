import express from "express";
import {
  createProductCatalogueEntry,
  bulkImportProductCatalogue,
  deleteProductCatalogueEntry,
  getProductCatalogue,
} from "../controllers/productCatalogueController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("Admin", "Supply Chain", "Management"), getProductCatalogue);
router.post("/", protect, authorizeRoles("Admin", "Supply Chain"), createProductCatalogueEntry);
router.post("/bulk-import", protect, authorizeRoles("Admin", "Supply Chain"), bulkImportProductCatalogue);
router.delete("/:id", protect, authorizeRoles("Admin", "Supply Chain"), deleteProductCatalogueEntry);

export default router;
