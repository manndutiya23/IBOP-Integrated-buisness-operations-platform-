import mongoose from "mongoose";
import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";
import ProductCatalogue from "../models/ProductCatalogue.js";
import Expense from "../models/Expense.js";
import Manufacturer from "../models/Manufacturer.js";
import Counter from "../models/Counter.js";

const roundCurrency = (value) => Number(value.toFixed(2));
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
      if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 1000000 ||
          !Number.isFinite(purchasePrice) || purchasePrice < 0 || purchasePrice > 100000000 ||
          !Number.isFinite(gst) || gst < 0 || gst > 100 ||
          (typeof item.purchasePrice === "number" && !Number.isInteger(item.purchasePrice * 100)) ||
          (typeof item.purchasePrice === "string" && !/^\d+(?:\.\d{1,2})?$/.test(item.purchasePrice.trim()))) {
        return res.status(400).json({ message: "Check quantity, purchase price (maximum 2 decimal places) and GST on every line." });
      }
      const catalogueProduct = await ProductCatalogue.findById(item.productCatalogueId).select("productCode name");
      if (!catalogueProduct) return res.status(400).json({ message: "A selected product no longer exists in the Product List. Refresh and try again." });
      prepared.push({ productCatalogueId: catalogueProduct._id, productCode: catalogueProduct.productCode, productName: catalogueProduct.name, quantity, purchasePrice, gst });
    }
    // Round each line's taxable value and GST to paise before aggregation.
    const lineTotals = prepared.map((item) => {
      const lineSubtotal = roundCurrency(item.quantity * item.purchasePrice);
      const lineGst = roundCurrency(lineSubtotal * item.gst / 100);
      return { lineSubtotal, lineGst };
    });
    const subtotal = roundCurrency(lineTotals.reduce((sum, line) => sum + line.lineSubtotal, 0));
    const gstAmount = roundCurrency(lineTotals.reduce((sum, line) => sum + line.lineGst, 0));
    const finalAmount = roundCurrency(subtotal + gstAmount);
    if (![subtotal, gstAmount, finalAmount].every(Number.isFinite)) {
      return res.status(400).json({ message: "Purchase totals exceed the supported amount range." });
    }

    let purchaseDate = new Date();
    if (date !== undefined && date !== null && date !== "") {
      if (typeof date !== "string" || Number.isNaN(Date.parse(date))) {
        return res.status(400).json({ message: "Enter a valid purchase date." });
      }
      purchaseDate = new Date(date);
      if (Number.isNaN(purchaseDate.getTime())) {
        return res.status(400).json({ message: "Enter a valid purchase date." });
      }
    }

    // MongoDB atomically increments this sequence, preventing invoice-number
    // collisions when multiple purchase orders are created concurrently.
    const counter = await Counter.findOneAndUpdate(
      { _id: "purchaseInvoice" },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    const invoiceNumber = `PO-${String(counter.sequence).padStart(6, "0")}`;
    const purchase = await Purchase.create({
      invoiceNumber,
      supplierId: supplier._id,
      supplierName,
      items: prepared,
      subtotal,
      gstAmount,
      finalAmount,
      date: purchaseDate,
      status: "Pending",
    });
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
    const { id } = req.params;
    const items = req.body?.items;
    if (!validId(id)) {
      return res.status(400).json({ message: "Invalid purchase invoice ID." });
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
      return res.status(400).json({ message: "Select between 1 and 100 purchase lines to receive." });
    }

    // Reject duplicate line references instead of silently creating multiple
    // inventory batches for the same purchase line in one receipt request.
    const purchaseItemIds = new Set();
    for (const received of items) {
      if (!received || typeof received !== "object" || Array.isArray(received) ||
          !validId(received.purchaseItemId)) {
        return res.status(400).json({ message: "Every receipt row must reference a valid purchase line." });
      }
      const lineId = String(received.purchaseItemId);
      if (purchaseItemIds.has(lineId)) {
        return res.status(400).json({ message: "A purchase line can appear only once in a goods receipt." });
      }
      purchaseItemIds.add(lineId);

      const quantity = Number(received.quantity);
      if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 1000000) {
        return res.status(400).json({ message: "Received quantity must be a positive whole number within the allowed range." });
      }
      if (received.batchNumber !== undefined && received.batchNumber !== null &&
          typeof received.batchNumber !== "string") {
        return res.status(400).json({ message: "Batch number must be text." });
      }
      const batchNumber = typeof received.batchNumber === "string" ? received.batchNumber.trim() : "";
      if (batchNumber.length > 100) {
        return res.status(400).json({ message: "Batch number cannot exceed 100 characters." });
      }
      if (received.expiryDate !== undefined && received.expiryDate !== null && received.expiryDate !== "") {
        if (typeof received.expiryDate !== "string" || Number.isNaN(Date.parse(received.expiryDate))) {
          return res.status(400).json({ message: "Enter a valid expiry date." });
        }
      }
    }

    let updatedPurchase, createdExpense;
    await session.withTransaction(async () => {
      // The purchase document is read and then written in this transaction.
      // Concurrent receipts contend on the same document; MongoDB retries
      // transient transaction conflicts and this callback rechecks outstanding
      // quantities against the latest committed purchase state.
      const purchase = await Purchase.findById(id).session(session);
      if (!purchase) {
        const error = new Error("Purchase invoice not found.");
        error.status = 404;
        throw error;
      }

      const receiptLines = [];
      let receivedSubtotal = 0;
      let receivedGst = 0;

      for (const received of items) {
        const line = purchase.items.id(received.purchaseItemId);
        const quantity = Number(received.quantity);
        if (!line) {
          const error = new Error("A selected purchase line does not belong to this purchase invoice.");
          error.status = 400;
          throw error;
        }
        if (!Number.isSafeInteger(line.receivedQuantity) ||
            !Number.isSafeInteger(line.quantity) ||
            line.receivedQuantity < 0 ||
            line.receivedQuantity + quantity > line.quantity) {
          const error = new Error("Received quantity cannot exceed the outstanding quantity for a purchase line.");
          error.status = 409;
          throw error;
        }

        const batchNumber = typeof received.batchNumber === "string" ? received.batchNumber.trim() : "";
        const expiryDate = received.expiryDate ? new Date(received.expiryDate) : null;
        if (expiryDate && Number.isNaN(expiryDate.getTime())) {
          const error = new Error("Enter a valid expiry date.");
          error.status = 400;
          throw error;
        }

        const lineSubtotal = roundCurrency(quantity * line.purchasePrice);
        const lineGst = roundCurrency(lineSubtotal * line.gst / 100);
        if (!Number.isFinite(lineSubtotal) || !Number.isFinite(lineGst)) {
          const error = new Error("Receipt totals exceed the supported amount range.");
          error.status = 400;
          throw error;
        }
        receivedSubtotal += lineSubtotal;
        receivedGst += lineGst;

        const inventoryProduct = await Product.create([{
          name: line.productName,
          price: line.purchasePrice,
          stock: quantity,
          batchNumber,
          expiryDate,
          productCatalogueId: line.productCatalogueId,
          productCode: line.productCode,
        }], { session });

        line.receivedQuantity += quantity;
        receiptLines.push({
          purchaseItemId: line._id,
          quantity,
          batchNumber,
          expiryDate,
          inventoryProductId: inventoryProduct[0]._id,
        });
      }

      const expenseAmount = roundCurrency(receivedSubtotal + receivedGst);
      if (!Number.isFinite(expenseAmount)) {
        const error = new Error("Receipt total exceeds the supported amount range.");
        error.status = 400;
        throw error;
      }

      const allReceived = purchase.items.every((line) => line.receivedQuantity >= line.quantity);
      const anyReceived = purchase.items.some((line) => line.receivedQuantity > 0);
      purchase.status = allReceived ? "Received" : anyReceived ? "Partially Received" : "Pending";
      purchase.receipts.push({
        receivedBy: req.employee?._id,
        lines: receiptLines,
      });
      await purchase.save({ session });

      const receiptId = purchase.receipts[purchase.receipts.length - 1]._id;
      const [expense] = await Expense.create([{
        title: `Goods received - ${purchase.invoiceNumber} - ${purchase.supplierName}`,
        amount: expenseAmount,
        category: "Purchase",
        date: new Date(),
        purchaseId: purchase._id,
        receiptId,
        supplierName: purchase.supplierName,
      }], { session });

      createdExpense = expense;
      updatedPurchase = purchase;
    });

    return res.status(200).json({
      message: "Verified goods receipt recorded, inventory updated and Finance expense posted.",
      purchase: updatedPurchase,
      expense: createdExpense,
    });
  } catch (error) {
    console.error("RECEIVE PURCHASE ERROR:", error);
    return res.status(error.status || 500).json({
      message: error.message || "Failed to record goods receipt.",
    });
  } finally {
    await session.endSession();
  }
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
