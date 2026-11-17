import mongoose from "mongoose";
const purchaseItemSchema = new mongoose.Schema({
  productCatalogueId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCatalogue", required: true },
  productCode: { type: String, required: true, trim: true },
  productName: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  purchasePrice: { type: Number, required: true, min: 0 },
  gst: { type: Number, default: 0, min: 0, max: 100 },
  receivedQuantity: { type: Number, default: 0, min: 0 },
}, { _id: true });
const purchaseSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true, sparse: true, trim: true },
  supplierName: { type: String, required: true, trim: true },
  items: { type: [purchaseItemSchema], default: [] },
  subtotal: { type: Number, default: 0 },
  gstAmount: { type: Number, default: 0 },
  finalAmount: { type: Number, default: 0 },
  status: { type: String, enum: ["Pending", "Partially Received", "Received"], default: "Pending" },
  date: { type: Date, default: Date.now },
  receipts: [{
    receivedAt: { type: Date, default: Date.now },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    lines: [{ purchaseItemId: mongoose.Schema.Types.ObjectId, quantity: Number, batchNumber: String, expiryDate: Date, inventoryProductId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" } }],
  }],
}, { timestamps: true });
export default mongoose.model("Purchase", purchaseSchema);
