import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  batchNumber: { type: String },
  expiryDate: { type: Date },
  productCatalogueId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCatalogue" },
  productCode: { type: String, trim: true },
}, { timestamps: true });
productSchema.index({ productCatalogueId: 1, batchNumber: 1, expiryDate: 1 });
const Product = mongoose.model("Product", productSchema);
export default Product;
