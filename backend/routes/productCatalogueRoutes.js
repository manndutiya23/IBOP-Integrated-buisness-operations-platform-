import express from "express";
import {
  createProductCatalogueEntry,
  getProductCatalogue,
} from "../controllers/productCatalogueController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("Admin", "Supply Chain", "Management"), getProductCatalogue);
router.post("/", protect, authorizeRoles("Admin", "Supply Chain"), createProductCatalogueEntry);

export default router;
