import express from "express";
import { createSale, deleteSale, getSales } from "../controllers/saleController.js";


const router = express.Router();

router.post("/", createSale);
router.get("/", getSales);
router.delete("/:id", deleteSale);

export default router;