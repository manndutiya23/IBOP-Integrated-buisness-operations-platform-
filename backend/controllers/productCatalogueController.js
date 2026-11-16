import ProductCatalogue from "../models/ProductCatalogue.js";

const optionalText = (value) => typeof value === "string" ? value.trim() : "";
const optionalRate = (value, label, errors) => {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 100) {
    errors.push(`${label} must be between 0 and 100.`);
    return null;
  }
  return number;
};

export const getProductCatalogue = async (req, res) => {
  try {
    const products = await ProductCatalogue.find({})
      .select("productCode name nick manufacturerDivision productType hsnCode igstRate cgstRate sgstRate createdAt updatedAt")
      .collation({ locale: "en", strength: 2 })
      .sort({ productCode: 1 })
      .lean();
    res.set("Cache-Control", "private, no-store");
    return res.status(200).json(products);
  } catch (error) {
    console.error("GET PRODUCT CATALOGUE ERROR:", error);
    return res.status(500).json({ message: "Unable to fetch product catalogue" });
  }
};

export const createProductCatalogueEntry = async (req, res) => {
  try {
    const productCode = optionalText(req.body.productCode);
    const name = optionalText(req.body.name);
    const nick = optionalText(req.body.nick);
    const manufacturerDivision = optionalText(req.body.manufacturerDivision);
    const productType = optionalText(req.body.productType);
    const hsnCode = optionalText(req.body.hsnCode);
    const errors = [];

    if (!productCode) errors.push("Product Code is required.");
    if (!name) errors.push("Product Name is required.");
    if (productCode.length > 64) errors.push("Product Code cannot exceed 64 characters.");
    if (name.length > 200) errors.push("Product Name cannot exceed 200 characters.");
    if (nick.length > 120) errors.push("Nickname cannot exceed 120 characters.");
    if (manufacturerDivision.length > 200) errors.push("Manufacturer / Division cannot exceed 200 characters.");
    if (productType.length > 100) errors.push("Product Type cannot exceed 100 characters.");
    if (hsnCode.length > 32) errors.push("HSN Code cannot exceed 32 characters.");

    const igstRate = optionalRate(req.body.igstRate, "IGST Rate", errors);
    const cgstRate = optionalRate(req.body.cgstRate, "CGST Rate", errors);
    const sgstRate = optionalRate(req.body.sgstRate, "SGST Rate", errors);

    if (errors.length) {
      return res.status(400).json({ message: "Please correct the product details.", errors });
    }

    const existing = await ProductCatalogue.findOne({ productCode })
      .collation({ locale: "en", strength: 2 })
      .select("_id");
    if (existing) {
      return res.status(409).json({
        message: `Product Code "${productCode}" already exists in the catalogue.`,
        field: "productCode",
      });
    }

    const product = await ProductCatalogue.create({
      productCode, name, nick, manufacturerDivision, productType, hsnCode,
      igstRate, cgstRate, sgstRate, source: "Manual entry",
    });

    return res.status(201).json({
      message: "Product added to the catalogue. No warehouse stock was created.",
      product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "That Product Code is already registered in the catalogue.",
        field: "productCode",
      });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Product details failed validation.",
        errors: Object.values(error.errors).map((item) => item.message),
      });
    }
    console.error("CREATE PRODUCT CATALOGUE ERROR:", error);
    return res.status(500).json({ message: "Unable to add product to the catalogue." });
  }
};
