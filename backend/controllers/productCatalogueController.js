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


/**
 * Permanently remove a product master record.
 * This does not touch the separate warehouse Product collection.
 */
export const deleteProductCatalogueEntry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({ message: "Invalid product catalogue ID." });
    }

    const deletedProduct = await ProductCatalogue.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product was not found in the catalogue." });
    }

    return res.status(200).json({
      message: `Product "${deletedProduct.name}" (${deletedProduct.productCode}) was removed from the catalogue.`,
      deletedProductId: deletedProduct._id,
    });
  } catch (error) {
    console.error("DELETE PRODUCT CATALOGUE ERROR:", error);
    return res.status(500).json({ message: "Unable to delete product from the catalogue." });
  }
};


/**
 * Import the approved product master in bulk.
 * Existing Product Codes are skipped; this endpoint never creates warehouse stock.
 */
export const bulkImportProductCatalogue = async (req, res) => {
  try {
    const rows = req.body?.products;
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: "Upload a CSV containing product records." });
    }
    if (rows.length > 10000) {
      return res.status(413).json({ message: "A maximum of 10,000 product rows can be imported at once." });
    }

    const errors = [];
    const seen = new Set();
    const prepared = [];
    let invalid = 0;
    let duplicateInFile = 0;

    rows.forEach((row, index) => {
      const productCode = optionalText(row.productCode);
      const name = optionalText(row.name);
      if (!productCode || !name) {
        invalid += 1;
        if (errors.length < 20) errors.push(`Row ${index + 2}: Product Code and Product Name are required.`);
        return;
      }
      const key = productCode.toLocaleLowerCase("en");
      if (seen.has(key)) {
        duplicateInFile += 1;
        return;
      }
      seen.add(key);

      const textFields = {
        nick: optionalText(row.nick),
        manufacturerDivision: optionalText(row.manufacturerDivision),
        productType: optionalText(row.productType),
        hsnCode: optionalText(row.hsnCode),
      };
      if (productCode.length > 64 || name.length > 200 ||
          textFields.nick.length > 120 || textFields.manufacturerDivision.length > 200 ||
          textFields.productType.length > 100 || textFields.hsnCode.length > 32) {
        invalid += 1;
        if (errors.length < 20) errors.push(`Row ${index + 2}: One or more fields exceed the allowed length.`);
        return;
      }

      const rates = {};
      let rateInvalid = false;
      for (const [field, label] of [["igstRate", "IGST"], ["cgstRate", "CGST"], ["sgstRate", "SGST"]]) {
        const raw = row[field];
        if (raw === "" || raw === null || raw === undefined) {
          rates[field] = null;
        } else {
          const value = Number(raw);
          if (!Number.isFinite(value) || value < 0 || value > 100) rateInvalid = true;
          else rates[field] = value;
        }
      }
      if (rateInvalid) {
        invalid += 1;
        if (errors.length < 20) errors.push(`Row ${index + 2}: GST rates must be numeric values between 0 and 100.`);
        return;
      }

      prepared.push({
        productCode, name, ...textFields, ...rates,
        source: "Product Manufacturer List",
      });
    });

    const codes = prepared.map((item) => item.productCode);
    const existing = codes.length
      ? await ProductCatalogue.find({ productCode: { $in: codes } })
          .collation({ locale: "en", strength: 2 })
          .select("productCode")
          .lean()
      : [];
    const existingCodes = new Set(existing.map((item) => item.productCode.toLocaleLowerCase("en")));
    const toInsert = prepared.filter((item) => !existingCodes.has(item.productCode.toLocaleLowerCase("en")));
    const skippedExisting = prepared.length - toInsert.length;

    let inserted = 0;
    if (toInsert.length) {
      const result = await ProductCatalogue.insertMany(toInsert, { ordered: false });
      inserted = result.length;
    }

    return res.status(200).json({
      message: "Product catalogue import completed. Warehouse inventory was not changed.",
      summary: {
        received: rows.length,
        inserted,
        skippedExisting,
        skippedDuplicateInFile: duplicateInFile,
        skippedInvalid: invalid,
      },
      errors,
    });
  } catch (error) {
    if (error.writeErrors) {
      console.error("BULK PRODUCT CATALOGUE PARTIAL IMPORT ERROR:", error);
      return res.status(207).json({
        message: "Import completed with some database write conflicts. Review the catalogue before retrying.",
        inserted: error.result?.insertedCount || 0,
        errors: error.writeErrors.slice(0, 20).map((item) => item.errmsg || "Duplicate product code."),
      });
    }
    console.error("BULK IMPORT PRODUCT CATALOGUE ERROR:", error);
    return res.status(500).json({ message: "Unable to import the product catalogue." });
  }
};
