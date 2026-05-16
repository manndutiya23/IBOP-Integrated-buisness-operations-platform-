import Invoice from "../models/Invoice.js";


export const createInvoice = async (req, res) => {
  try {
    console.log("INCOMING DATA:", req.body);

    const subtotal = Number(req.body.totalPrice || 0);
    const discountPercent = Number(req.body.discountPercent ?? req.body.discount ?? 0);
    const discountAmount = Number(req.body.discountAmount ?? subtotal * (discountPercent / 100));
    const taxable = subtotal - discountAmount;
    const gst = Number(req.body.gst ?? taxable * 0.18);
    const finalAmount = Number(req.body.finalAmount ?? taxable + gst);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const invoice = new Invoice({
      ...req.body,

      subtotal,
      discountPercent,
      discountAmount,
      gst,
      finalAmount,

      status: "unpaid",

      dueDate,
    });

    await invoice.save();

    res.status(201).json(invoice);

  } catch (error) {

    console.error("CREATE INVOICE ERROR:", error);

    res.status(500).json({
      message: "Error creating invoice",
    });
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

export const updateInvoiceStatus = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    invoice.status =
      invoice.status === "paid"
        ? "unpaid"
        : "paid";

    await invoice.save();

    res.json(invoice);
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);

    res.status(500).json({
      message: "Error updating invoice status",
    });
  }
};
