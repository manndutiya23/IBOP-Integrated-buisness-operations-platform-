import express from "express";
import { createPurchase, getPurchases, receivePurchaseItems, deletePurchase } from "../controllers/purchaseController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", protect, authorizeRoles("Admin", "Supply Chain"), createPurchase);
router.get("/", protect, authorizeRoles("Admin", "Supply Chain", "Management"), getPurchases);
router.post("/:id/receive", protect, authorizeRoles("Admin", "Supply Chain"), receivePurchaseItems);
router.delete("/:id", protect, authorizeRoles("Admin", "Supply Chain"), deletePurchase);
export default router;
