import express from "express";
import { createInvoice, getInvoices, updateInvoiceStatus } from "../controllers/invoiceController.js";


const router = express.Router();

router.post("/", createInvoice);
router.get("/", getInvoices);
router.patch("/:id/status", updateInvoiceStatus);

export default router;