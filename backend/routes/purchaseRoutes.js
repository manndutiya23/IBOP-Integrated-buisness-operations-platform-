import express from "express";
import { createPurchase, getPurchases, receivePurchaseItems } from "../controllers/purchaseController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", protect, authorizeRoles("Admin", "Supply Chain"), createPurchase);
router.get("/", protect, authorizeRoles("Admin", "Supply Chain", "Management"), getPurchases);
router.post("/:id/receive", protect, authorizeRoles("Admin", "Supply Chain"), receivePurchaseItems);
export default router;
