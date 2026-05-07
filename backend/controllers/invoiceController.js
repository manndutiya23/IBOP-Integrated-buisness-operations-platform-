import Invoice from "../models/Invoice.js";

export const createInvoice = async (req, res) => {
  try {
    console.log("INCOMING DATA:", req.body);
    const invoice = new Invoice(req.body);
    await invoice.save();
    invoice.status = "unpaid";
    res.status(201).json(invoice);
  } catch (error) {
    console.error("CREATE INVOICE ERROR:", error);
    res.status(500).json({ message: "Error creating invoice" });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    console.error("GET INVOICES ERROR:", error);
    res.status(500).json({ message: "Error fetching invoices" });
  }
};
