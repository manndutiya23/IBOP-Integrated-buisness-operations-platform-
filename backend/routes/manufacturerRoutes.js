import express from "express";
import { getManufacturers, createManufacturer, deleteManufacturer, bulkImportManufacturers } from "../controllers/manufacturerController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/", protect, authorizeRoles("Admin", "Supply Chain", "Management"), getManufacturers);
router.post("/", protect, authorizeRoles("Admin", "Supply Chain"), createManufacturer);
router.post("/bulk-import", protect, authorizeRoles("Admin", "Supply Chain"), bulkImportManufacturers);
router.delete("/:id", protect, authorizeRoles("Admin", "Supply Chain"), deleteManufacturer);
export default router;
