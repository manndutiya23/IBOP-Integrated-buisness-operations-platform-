import mongoose from "mongoose";

const inventoryAdjustmentSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  productName: { type: String, required: true, trim: true },
  productCode: { type: String, default: "" },
  batchNumber: { type: String, default: "" },
  previousStock: { type: Number, required: true, min: 0 },
  quantityChange: { type: Number, required: true },
  newStock: { type: Number, required: true, min: 0 },
  reason: { type: String, required: true, trim: true, maxlength: 500 },
  adjustedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true, index: true },
}, { timestamps: true, versionKey: false });

inventoryAdjustmentSchema.index({ createdAt: -1 });
export default mongoose.model("InventoryAdjustment", inventoryAdjustmentSchema);
