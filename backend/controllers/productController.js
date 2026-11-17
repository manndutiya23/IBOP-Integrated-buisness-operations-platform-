import mongoose from "mongoose";
import Product from "../models/Product.js";
import InventoryAdjustment from "../models/InventoryAdjustment.js";

const validId = (value) => mongoose.isValidObjectId(value);
const sendServerError = (res, error, label) => {
  console.error(label, error);
  return res.status(500).json({ message: "The inventory request could not be completed." });
};

// GET inventory batches
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.set("Cache-Control", "private, no-store");
    return res.json(products);
  } catch (error) {
    return sendServerError(res, error, "GET INVENTORY ERROR:");
  }
};

// Inventory batches are created only by the verified goods-receipt workflow.
export const createProduct = async (req, res) => {
  return res.status(409).json({
    message: "Inventory batches can only be created by recording a verified goods receipt. Add products to the Product List before ordering them.",
  });
};

// Update descriptive batch details only. Stock is never editable through this endpoint.
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validId(id)) return res.status(400).json({ message: "Invalid inventory batch ID." });

    const allowedFields = ["name", "price", "batchNumber", "expiryDate"];
    const suppliedFields = Object.keys(req.body || {});
    if (!suppliedFields.length || suppliedFields.some((field) => !allowedFields.includes(field))) {
      return res.status(400).json({ message: "Only batch name, unit price, batch number and expiry date can be edited here. Use the stock-adjustment workflow for quantity corrections." });
    }

    const update = {};
    if (Object.hasOwn(req.body, "name")) {
      if (typeof req.body.name !== "string" || !req.body.name.trim() || req.body.name.trim().length > 200) return res.status(400).json({ message: "Enter a valid product name (maximum 200 characters)." });
      update.name = req.body.name.trim();
    }
    if (Object.hasOwn(req.body, "price")) {
      const price = Number(req.body.price);
      if (!Number.isFinite(price) || price < 0 || price > 100000000) return res.status(400).json({ message: "Unit price must be a valid non-negative amount." });
      update.price = price;
    }
    if (Object.hasOwn(req.body, "batchNumber")) {
      if (typeof req.body.batchNumber !== "string" || req.body.batchNumber.trim().length > 100) return res.status(400).json({ message: "Batch number must be text up to 100 characters." });
      update.batchNumber = req.body.batchNumber.trim();
    }
    if (Object.hasOwn(req.body, "expiryDate")) {
      const date = req.body.expiryDate ? new Date(req.body.expiryDate) : null;
      if (date && Number.isNaN(date.getTime())) return res.status(400).json({ message: "Enter a valid expiry date." });
      update.expiryDate = date;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
    if (!updatedProduct) return res.status(404).json({ message: "Inventory batch not found." });
    return res.json(updatedProduct);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") return res.status(400).json({ message: "Invalid inventory batch details." });
    return sendServerError(res, error, "UPDATE INVENTORY ERROR:");
  }
};

// Record a reasoned, auditable stock correction against an existing batch.
export const adjustProductStock = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;
    const quantityChange = Number(req.body?.quantityChange);
    const reason = typeof req.body?.reason === "string" ? req.body.reason.trim() : "";

    if (!validId(id)) return res.status(400).json({ message: "Invalid inventory batch ID." });
    if (!Number.isSafeInteger(quantityChange) || quantityChange === 0 || Math.abs(quantityChange) > 1000000) return res.status(400).json({ message: "Stock correction must be a non-zero whole number within the allowed range." });
    if (reason.length < 5 || reason.length > 500) return res.status(400).json({ message: "Provide a reason between 5 and 500 characters." });

    let updatedProduct, adjustment;
    await session.withTransaction(async () => {
      const product = await Product.findById(id).session(session);
      if (!product) {
        const error = new Error("Inventory batch not found.");
        error.status = 404;
        throw error;
      }
      const nextStock = product.stock + quantityChange;
      if (!Number.isSafeInteger(nextStock) || nextStock < 0) {
        const error = new Error("Stock correction cannot make the batch quantity negative.");
        error.status = 400;
        throw error;
      }
      product.stock = nextStock;
      await product.save({ session });
      [adjustment] = await InventoryAdjustment.create([{
        productId: product._id,
        productName: product.name,
        productCode: product.productCode || "",
        batchNumber: product.batchNumber || "",
        previousStock: nextStock - quantityChange,
        quantityChange,
        newStock: nextStock,
        reason,
        adjustedBy: req.employee._id,
      }], { session });
      updatedProduct = product;
    });

    return res.status(200).json({ message: "Stock correction recorded.", product: updatedProduct, adjustment });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    return sendServerError(res, error, "ADJUST INVENTORY ERROR:");
  } finally {
    await session.endSession();
  }
};

// Delete is intentionally retained for Admin, with the existing role restriction.
export const deleteProduct = async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid inventory batch ID." });
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Inventory batch not found." });
    return res.json({ message: "Inventory batch deleted." });
  } catch (error) {
    return sendServerError(res, error, "DELETE INVENTORY ERROR:");
  }
};
