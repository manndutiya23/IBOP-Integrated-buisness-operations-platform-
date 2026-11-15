import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Stable identifier from Shrinath Enterprises' existing product catalogue.
    // Legacy inventory records may not have a productCode.
    productCode: { type: String, trim: true },
    nick: { type: String, trim: true },
    manufacturerDivision: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    productType: { type: String, trim: true },
    igstRate: { type: Number, min: 0 },
    cgstRate: { type: Number, min: 0 },
    sgstRate: { type: Number, min: 0 },
    hsnCode: { type: String, trim: true },

    // Catalogue records can exist without warehouse stock or a known price.
    price: { type: Number, required: true, default: 0, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    batchNumber: { type: String, trim: true },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

// Legacy inventory records without productCode remain valid.
productSchema.index(
  { productCode: 1 },
  {
    unique: true,
    partialFilterExpression: { productCode: { $type: "string" } },
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
