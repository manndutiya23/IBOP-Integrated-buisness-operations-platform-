import express from "express";
import { getProductCatalogue } from "../controllers/productCatalogueController.js";
import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Catalogue visibility is restricted to Supply Chain, Management and Admin.
router.get(
  "/",
  protect,
  authorizeRoles("Admin", "Supply Chain", "Management"),
  getProductCatalogue
);

export default router;
