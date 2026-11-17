import express from "express";
import { getManufacturers, bulkImportManufacturers } from "../controllers/manufacturerController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/", protect, authorizeRoles("Admin", "Supply Chain", "Management"), getManufacturers);
router.post("/bulk-import", protect, authorizeRoles("Admin", "Supply Chain"), bulkImportManufacturers);
export default router;
