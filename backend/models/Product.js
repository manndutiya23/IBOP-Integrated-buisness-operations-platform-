import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  price: { type: Number, required: true, min: 0, max: 100000000 },
  stock: { type: Number, required: true, min: 0, max: 1000000, validate: { validator: Number.isSafeInteger, message: "Stock must be a whole number." } },
  batchNumber: { type: String, trim: true, maxlength: 100, default: "" },
  expiryDate: { type: Date, default: null },
  productCatalogueId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductCatalogue" },
  productCode: { type: String, trim: true, maxlength: 64 },
}, { timestamps: true });
productSchema.index({ productCatalogueId: 1, batchNumber: 1, expiryDate: 1 });
const Product = mongoose.model("Product", productSchema);
export default Product;
