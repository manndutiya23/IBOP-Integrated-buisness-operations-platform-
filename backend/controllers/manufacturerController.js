import Manufacturer from "../models/Manufacturer.js";
import Purchase from "../models/Purchase.js";

const clean = (value) => value === null || value === undefined ? "" : String(value).trim();
const fields = ["cCode","ledgerAccount","city","area","add1","add2","state","status","pinCode","email","gstin","gstDate","salesman","cdPercent","contactPerson","telephone","mobile","sms"];

export const getManufacturers = async (req, res) => {
  try {
    const records = await Manufacturer.find({}).sort({ ledgerAccount: 1 }).lean();
    res.set("Cache-Control", "private, no-store");
    return res.json(records);
  } catch (error) {
    console.error("GET MANUFACTURERS ERROR:", error);
    return res.status(500).json({ message: "Unable to fetch manufacturer list." });
  }
};

export const createManufacturer = async (req, res) => {
  try {
    const record = Object.fromEntries(fields.map((field) => [field, clean(req.body?.[field])]));
    if (!record.cCode || !record.ledgerAccount) return res.status(400).json({ message: "CCode and Ledger Account are required." });
    if (record.cCode.length > 40 || record.ledgerAccount.length > 250 || fields.some((field) => record[field].length > 1000)) return res.status(400).json({ message: "One or more fields exceed the allowed length." });
    const manufacturer = await Manufacturer.create({ ...record, source: "Manual entry" });
    return res.status(201).json({ message: "Supplier added to Manufacturer List.", manufacturer });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "This CCode + Ledger Account combination already exists." });
    console.error("CREATE MANUFACTURER ERROR:", error);
    return res.status(500).json({ message: "Unable to add supplier." });
  }
};

export const deleteManufacturer = async (req, res) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) return res.status(400).json({ message: "Invalid supplier ID." });
    const linkedPurchase = await Purchase.findOne({ supplierId: req.params.id }).select("_id invoiceNumber").lean();
    if (linkedPurchase) return res.status(409).json({ message: "This supplier is linked to purchase invoices and cannot be deleted." });
    const deleted = await Manufacturer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Supplier not found." });
    return res.json({ message: "Supplier deleted from Manufacturer List.", supplierId: deleted._id });
  } catch (error) {
    console.error("DELETE MANUFACTURER ERROR:", error);
    return res.status(500).json({ message: "Unable to delete supplier." });
  }
};

export const bulkImportManufacturers = async (req, res) => {
  try {
    const rows = req.body?.manufacturers;
    if (!Array.isArray(rows) || !rows.length) {
      return res.status(400).json({ message: "Upload a CSV containing manufacturer records." });
    }
    if (rows.length > 5000) {
      return res.status(413).json({ message: "A maximum of 5,000 manufacturer rows can be imported at once." });
    }

    const seen = new Set();
    const prepared = [];
    const errors = [];
    let duplicatesInFile = 0;
    let invalid = 0;
    const addRowError = (message) => {
      if (errors.length < 50) errors.push(message);
    };

    rows.forEach((row, index) => {
      const rowNumber = index + 2;
      if (!row || typeof row !== "object" || Array.isArray(row)) {
        invalid += 1;
        addRowError(`Row ${rowNumber}: Expected a manufacturer record with named fields.`);
        return;
      }

      const record = Object.fromEntries(fields.map((field) => [field, clean(row[field])]));
      if (!record.cCode || !record.ledgerAccount) {
        invalid += 1;
        addRowError(`Row ${rowNumber}: CCode and Ledger Account are required.`);
        return;
      }
      if (record.cCode.length > 40 || record.ledgerAccount.length > 250 ||
          fields.some((field) => record[field].length > 1000)) {
        invalid += 1;
        addRowError(`Row ${rowNumber}: One or more fields exceed allowed length.`);
        return;
      }

      const key = `${record.cCode.toLocaleLowerCase("en")}|${record.ledgerAccount.toLocaleLowerCase("en")}`;
      if (seen.has(key)) {
        duplicatesInFile += 1;
        return;
      }
      seen.add(key);
      prepared.push({
        rowNumber,
        manufacturer: { ...record, source: "Manufacturer List CSV" },
      });
    });

    const existing = prepared.length
      ? await Manufacturer.find({
          $or: prepared.map(({ manufacturer }) => ({
            cCode: manufacturer.cCode,
            ledgerAccount: manufacturer.ledgerAccount,
          })),
        })
          .collation({ locale: "en", strength: 2 })
          .select("cCode ledgerAccount")
          .lean()
      : [];

    const existingKeys = new Set(existing.map((item) =>
      `${item.cCode.toLocaleLowerCase("en")}|${item.ledgerAccount.toLocaleLowerCase("en")}`
    ));
    const fresh = prepared.filter(({ manufacturer }) =>
      !existingKeys.has(
        `${manufacturer.cCode.toLocaleLowerCase("en")}|${manufacturer.ledgerAccount.toLocaleLowerCase("en")}`
      )
    );
    const skippedExisting = prepared.length - fresh.length;

    let inserted = 0;
    let failedDatabaseWrites = 0;
    if (fresh.length) {
      try {
        const result = await Manufacturer.insertMany(
          fresh.map(({ manufacturer }) => manufacturer),
          { ordered: false }
        );
        inserted = result.length;
      } catch (error) {
        if (!Array.isArray(error.writeErrors)) throw error;

        const failedIndexes = new Set();
        error.writeErrors.forEach((writeError) => {
          const index = Number(writeError.index);
          if (Number.isInteger(index) && index >= 0 && index < fresh.length) {
            failedIndexes.add(index);
            const failedRow = fresh[index];
            addRowError(
              `Row ${failedRow.rowNumber} (${failedRow.manufacturer.cCode} / ${failedRow.manufacturer.ledgerAccount}): ${writeError.errmsg || "Database rejected this record."}`
            );
          } else {
            addRowError(writeError.errmsg || "A database write failed for an unidentified row.");
          }
        });

        failedDatabaseWrites = error.writeErrors.length;
        if (failedIndexes.size === failedDatabaseWrites) {
          inserted = fresh.length - failedIndexes.size;
        } else if (Number.isInteger(error.result?.insertedCount)) {
          inserted = error.result.insertedCount;
        } else if (Number.isInteger(error.result?.nInserted)) {
          inserted = error.result.nInserted;
        } else if (Array.isArray(error.insertedDocs)) {
          inserted = error.insertedDocs.length;
        } else {
          inserted = null;
        }
      }
    }

    const summary = {
      received: rows.length,
      inserted,
      skippedExisting,
      skippedDuplicateInFile: duplicatesInFile,
      skippedInvalid: invalid,
      failedDatabaseWrites,
    };
    const hasIssues = invalid > 0 || duplicatesInFile > 0 || failedDatabaseWrites > 0;

    return res.status(failedDatabaseWrites > 0 ? 207 : 200).json({
      message: hasIssues
        ? "Manufacturer import completed with skipped or failed rows. Review the summary and row errors before retrying."
        : "Manufacturer list import completed.",
      summary,
      errors,
    });
  } catch (error) {
    console.error("BULK IMPORT MANUFACTURERS ERROR:", error);
    return res.status(500).json({ message: "Unable to import manufacturer list." });
  }
};
