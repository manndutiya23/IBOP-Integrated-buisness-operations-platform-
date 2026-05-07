import express from "express";
import { createInvoice, getInvoices } from "../controllers/invoiceController.js";
import { deleteAllInvoices } from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/", createInvoice);
router.get("/", getInvoices);
router.delete("/delete-all", deleteAllInvoices);

export default router;