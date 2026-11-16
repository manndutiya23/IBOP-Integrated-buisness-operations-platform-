import mongoose from "mongoose";

/**
 * ProductCatalogue represents the business's approved product master:
 * the products Shrinath Enterprises deals in.
 *
 * It is deliberately separate from Product, which currently represents
 * stock-bearing warehouse records used by sales and inventory workflows.
 * Do not add warehouse quantity, batch, purchase price or stock fields here.
 */
const productCatalogueSchema = new mongoose.Schema(
  {
    productCode: {
      type: String,
      required: [true, "Product code is required"],
      trim: true,
      immutable: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    nick: {
      type: String,
      trim: true,
      default: "",
    },
    manufacturerDivision: {
      type: String,
      trim: true,
      default: "",
    },
    productType: {
      type: String,
      trim: true,
      default: "",
    },
    hsnCode: {
      type: String,
      trim: true,
      default: "",
    },
    igstRate: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    cgstRate: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    sgstRate: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    source: {
      type: String,
      trim: true,
      default: "Product Manufacturer List",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Product codes are unique without treating letter case as significant.
productCatalogueSchema.index(
  { productCode: 1 },
  {
    unique: true,
    collation: { locale: "en", strength: 2 },
  }
);

productCatalogueSchema.index({
  name: "text",
  nick: "text",
  manufacturerDivision: "text",
  hsnCode: "text",
});

const ProductCatalogue = mongoose.model(
  "ProductCatalogue",
  productCatalogueSchema
);

export default ProductCatalogue;
