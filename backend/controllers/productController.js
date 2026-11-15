import Product from "../models/Product.js";

const IMPORT_FIELD_MAP = {
  "Product Code": "productCode",
  Nick: "nick",
  "Manufacturer / Division": "manufacturerDivision",
  "Product Name": "name",
  Type: "productType",
  "IGST%": "igstRate",
  "CGST/CST%": "cgstRate",
  "SGST/VAT%": "sgstRate",
  "HSN Code": "hsnCode",
};

const NUMERIC_FIELDS = new Set(["igstRate", "cgstRate", "sgstRate"]);
const MASTER_FIELDS = [
  "nick",
  "manufacturerDivision",
  "name",
  "productType",
  "igstRate",
  "cgstRate",
  "sgstRate",
  "hsnCode",
];

const cleanString = (value) =>
  value === null || value === undefined ? "" : String(value).trim();

const normalizeImportRow = (row, index) => {
  const errors = [];
  const product = {};

  for (const [sourceField, targetField] of Object.entries(IMPORT_FIELD_MAP)) {
    const value = cleanString(row?.[sourceField]);

    if (targetField === "productCode") {
      product.productCode = value;
    } else if (NUMERIC_FIELDS.has(targetField)) {
      if (value === "") {
        product[targetField] = null;
      } else {
        const parsed = Number(value);
        if (!Number.isFinite(parsed) || parsed < 0) {
          errors.push(`${sourceField} must be a non-negative number`);
        } else {
          product[targetField] = parsed;
        }
      }
    } else {
      product[targetField] = value || undefined;
    }
  }

  if (!product.productCode) errors.push("Product Code is required");
  if (!product.name) errors.push("Product Name is required");

  return { rowNumber: index + 1, product, errors };
};

const buildImportPreview = (rows) => {
  const normalized = rows.map(normalizeImportRow);
  const codeRows = new Map();

  normalized.forEach((entry) => {
    const code = entry.product.productCode;
    if (!code) return;
    if (!codeRows.has(code)) codeRows.set(code, []);
    codeRows.get(code).push(entry);
  });

  for (const [code, entries] of codeRows.entries()) {
    if (entries.length > 1) {
      entries.forEach((entry) => {
        entry.errors.push(`Duplicate Product Code "${code}" in uploaded file`);
      });
    }
  }

  const valid = normalized.filter((entry) => entry.errors.length === 0);
  const invalid = normalized.filter((entry) => entry.errors.length > 0);

  return { totalRows: rows.length, validRows: valid.length, invalidRows: invalid.length, invalid, valid };
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Legacy/manual inventory product creation remains supported.
export const createProduct = async (req, res) => {
  try {
    const { name, price = 0, stock = 0, batchNumber, expiryDate } = req.body;
    const product = new Product({ name, price, stock, batchNumber, expiryDate });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, batchNumber, expiryDate } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, stock, batchNumber, expiryDate },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/products/import
 * Body: { rows: [{ "Product Code": "...", ... }], dryRun: true|false }
 *
 * Imports catalogue fields only. Existing price, stock, batch and expiry data
 * are never modified by this operation. Invalid rows are reported and skipped.
 */
export const importProductCatalogue = async (req, res) => {
  try {
    const { rows, dryRun = true } = req.body ?? {};

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: "Request body must contain a non-empty rows array" });
    }
    if (rows.length > 10000) {
      return res.status(413).json({ message: "A maximum of 10,000 rows can be imported per request" });
    }
    if (typeof dryRun !== "boolean") {
      return res.status(400).json({ message: "dryRun must be a boolean" });
    }

    const preview = buildImportPreview(rows);
    const codes = preview.valid.map(({ product }) => product.productCode);
    const existing = codes.length
      ? await Product.find({ productCode: { $in: codes } }).select("productCode").lean()
      : [];
    const existingCodes = new Set(existing.map(({ productCode }) => productCode));
    const newProducts = preview.valid.filter(({ product }) => !existingCodes.has(product.productCode)).length;
    const existingProductsToUpdate = preview.valid.length - newProducts;

    const report = {
      dryRun,
      totalRows: preview.totalRows,
      validRows: preview.validRows,
      invalidRows: preview.invalidRows,
      newProducts,
      existingProductsToUpdate,
      invalid: preview.invalid.map(({ rowNumber, product, errors }) => ({
        rowNumber,
        productCode: product.productCode || null,
        productName: product.name || null,
        errors,
      })),
    };

    if (dryRun) {
      return res.status(200).json({ message: "Dry run completed. No database records were changed.", report });
    }
    if (preview.valid.length === 0) {
      return res.status(422).json({ message: "No valid product rows were available to import.", report });
    }

    const operations = preview.valid.map(({ product }) => {
      const masterData = {};
      for (const field of MASTER_FIELDS) {
        if (product[field] !== undefined) masterData[field] = product[field];
      }

      return {
        updateOne: {
          filter: { productCode: product.productCode },
          update: {
            $set: masterData,
            $setOnInsert: { productCode: product.productCode, price: 0, stock: 0 },
          },
          upsert: true,
        },
      };
    });

    const result = await Product.bulkWrite(operations, { ordered: false });

    return res.status(200).json({
      message: "Product catalogue import completed. Invalid rows were skipped.",
      report: {
        ...report,
        importedOrUpdated: result.upsertedCount + result.modifiedCount,
        inserted: result.upsertedCount,
        updated: result.modifiedCount,
        matchedWithoutChanges: result.matchedCount - result.modifiedCount,
      },
    });
  } catch (error) {
    console.error("PRODUCT CATALOGUE IMPORT ERROR:", error);
    res.status(500).json({ message: "Product catalogue import failed", error: error.message });
  }
};
