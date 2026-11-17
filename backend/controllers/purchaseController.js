import mongoose from "mongoose";
import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";
import ProductCatalogue from "../models/ProductCatalogue.js";
import Expense from "../models/Expense.js";
import Manufacturer from "../models/Manufacturer.js";
const validId = (value) => mongoose.isValidObjectId(value);

export const createPurchase = async (req, res) => {
  try {
    const { supplierId, items, date } = req.body;
    if (!validId(supplierId)) return res.status(400).json({ message: "Select a valid supplier from the Manufacturer List." });
    const supplier = await Manufacturer.findById(supplierId).select("ledgerAccount");
    if (!supplier) return res.status(400).json({ message: "Selected supplier no longer exists. Refresh the Manufacturer List and try again." });
    const supplierName = supplier.ledgerAccount;
    if (!Array.isArray(items) || items.length === 0 || items.length > 100) return res.status(400).json({ message: "Add between 1 and 100 catalogue products." });
    const prepared = [];
    for (const item of items) {
      if (!validId(item?.productCatalogueId)) return res.status(400).json({ message: "Every purchase line must reference a valid catalogue product." });
      const quantity = Number(item.quantity), purchasePrice = Number(item.purchasePrice), gst = Number(item.gst ?? 0);
      if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 1000000 || !Number.isFinite(purchasePrice) || purchasePrice < 0 || purchasePrice > 100000000 || !Number.isFinite(gst) || gst < 0 || gst > 100) return res.status(400).json({ message: "Check quantity, purchase price and GST on every line." });
      const catalogueProduct = await ProductCatalogue.findById(item.productCatalogueId).select("productCode name");
      if (!catalogueProduct) return res.status(400).json({ message: "A selected product no longer exists in the Product List. Refresh and try again." });
      prepared.push({ productCatalogueId: catalogueProduct._id, productCode: catalogueProduct.productCode, productName: catalogueProduct.name, quantity, purchasePrice, gst });
    }
    const subtotal = prepared.reduce((sum, item) => sum + item.quantity * item.purchasePrice, 0);
    const gstAmount = prepared.reduce((sum, item) => sum + item.quantity * item.purchasePrice * item.gst / 100, 0);
    const purchase = await Purchase.create({ invoiceNumber: `PO-${Date.now()}`, supplierId: supplier._id, supplierName, items: prepared, subtotal, gstAmount, finalAmount: subtotal + gstAmount, date: date ? new Date(date) : new Date(), status: "Pending" });
    return res.status(201).json({ message: "Purchase order created. Inventory and Finance were not changed.", purchase });
  } catch (error) {
    console.error("CREATE PURCHASE ERROR:", error);
    return res.status(500).json({ message: "Failed to create purchase." });
  }
};

export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 }).lean();
    res.set("Cache-Control", "private, no-store");
    return res.json(purchases);
  } catch (error) {
    console.error("GET PURCHASES ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch purchase invoices." });
  }
};

export const receivePurchaseItems = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params, { items } = req.body;
    if (!validId(id) || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "Select at least one valid purchase line to receive." });
    let updatedPurchase, createdExpense;
    await session.withTransaction(async () => {
      const purchase = await Purchase.findById(id).session(session);
      if (!purchase) { const error = new Error("Purchase invoice not found."); error.status = 404; throw error; }
      const receiptLines = [];
      let receivedSubtotal = 0, receivedGst = 0;
      for (const received of items) {
        const line = purchase.items.id(received.purchaseItemId), quantity = Number(received.quantity);
        if (!line || !Number.isSafeInteger(quantity) || quantity < 1 || line.receivedQuantity + quantity > line.quantity) { const error = new Error("Received quantity must be positive and cannot exceed the outstanding quantity."); error.status = 400; throw error; }
        const batchNumber = typeof received.batchNumber === "string" ? received.batchNumber.trim() : "";
        const expiryDate = received.expiryDate ? new Date(received.expiryDate) : null;
        if (expiryDate && Number.isNaN(expiryDate.getTime())) { const error = new Error("Enter a valid expiry date."); error.status = 400; throw error; }
        const lineSubtotal = quantity * line.purchasePrice;
        receivedSubtotal += lineSubtotal;
        receivedGst += lineSubtotal * line.gst / 100;
        const inventoryProduct = await Product.create([{ name: line.productName, price: line.purchasePrice, stock: quantity, batchNumber, expiryDate, productCatalogueId: line.productCatalogueId, productCode: line.productCode }], { session });
        line.receivedQuantity += quantity;
        receiptLines.push({ purchaseItemId: line._id, quantity, batchNumber, expiryDate, inventoryProductId: inventoryProduct[0]._id });
      }
      const allReceived = purchase.items.every((line) => line.receivedQuantity >= line.quantity);
      const anyReceived = purchase.items.some((line) => line.receivedQuantity > 0);
      purchase.status = allReceived ? "Received" : anyReceived ? "Partially Received" : "Pending";
      purchase.receipts.push({ receivedBy: req.employee?._id, lines: receiptLines });
      await purchase.save({ session });
      const receiptId = purchase.receipts[purchase.receipts.length - 1]._id;
      const [expense] = await Expense.create([{
        title: `Goods received - ${purchase.invoiceNumber} - ${purchase.supplierName}`,
        amount: receivedSubtotal + receivedGst,
        category: "Purchase",
        date: new Date(),
        purchaseId: purchase._id,
        receiptId,
        supplierName: purchase.supplierName,
      }], { session });
      createdExpense = expense;
      updatedPurchase = purchase;
    });
    return res.status(200).json({ message: "Verified goods receipt recorded, inventory updated and Finance expense posted.", purchase: updatedPurchase, expense: createdExpense });
  } catch (error) {
    console.error("RECEIVE PURCHASE ERROR:", error);
    return res.status(error.status || 500).json({ message: error.message || "Failed to record goods receipt." });
  } finally { await session.endSession(); }
};

export const deletePurchase = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid purchase invoice ID." });
    let deletedPurchase;
    let deletedInventoryCount = 0;
    let deletedExpenseCount = 0;

    await session.withTransaction(async () => {
      const purchase = await Purchase.findById(req.params.id).session(session);
      if (!purchase) {
        const error = new Error("Purchase invoice not found.");
        error.status = 404;
        throw error;
      }

      // Reverse only inventory records explicitly created by this purchase's
      // goods receipts. Do not touch unrelated stock records.
      const inventoryIds = (purchase.receipts || []).flatMap((receipt) =>
        (receipt.lines || []).map((line) => line.inventoryProductId).filter(Boolean)
      );
      if (inventoryIds.length) {
        const inventoryResult = await Product.deleteMany({ _id: { $in: inventoryIds } }).session(session);
        deletedInventoryCount = inventoryResult.deletedCount || 0;
      }

      const expenseResult = await Expense.deleteMany({ purchaseId: purchase._id }).session(session);
      deletedExpenseCount = expenseResult.deletedCount || 0;

      await Purchase.deleteOne({ _id: purchase._id }).session(session);
      deletedPurchase = purchase;
    });

    return res.status(200).json({
      message: "Purchase invoice and its linked test data were deleted.",
      purchaseId: deletedPurchase._id,
      deletedInventoryRecords: deletedInventoryCount,
      deletedFinanceExpenses: deletedExpenseCount,
    });
  } catch (error) {
    console.error("DELETE PURCHASE ERROR:", error);
    return res.status(error.status || 500).json({ message: error.message || "Failed to delete purchase invoice." });
  } finally {
    await session.endSession();
  }
};
