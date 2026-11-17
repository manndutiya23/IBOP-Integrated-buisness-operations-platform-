import Manufacturer from "../models/Manufacturer.js";

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

export const bulkImportManufacturers = async (req, res) => {
  try {
    const rows = req.body?.manufacturers;
    if (!Array.isArray(rows) || !rows.length) return res.status(400).json({ message: "Upload a CSV containing manufacturer records." });
    if (rows.length > 5000) return res.status(413).json({ message: "A maximum of 5,000 manufacturer rows can be imported at once." });
    const seen = new Set(), prepared = [], errors = [];
    let duplicatesInFile = 0, invalid = 0;
    rows.forEach((row, index) => {
      if (!row || typeof row !== "object") { invalid++; if(errors.length<20) errors.push(`Row ${index+2}: Invalid row.`); return; }
      const record = Object.fromEntries(fields.map((field) => [field, clean(row[field])]));
      if (!record.cCode || !record.ledgerAccount) { invalid++; if(errors.length<20) errors.push(`Row ${index+2}: CCode and Ledger Account are required.`); return; }
      if (record.cCode.length > 40 || record.ledgerAccount.length > 250 || fields.some((field) => record[field].length > 1000)) { invalid++; if(errors.length<20) errors.push(`Row ${index+2}: One or more fields exceed allowed length.`); return; }
      const key = `${record.cCode.toLocaleLowerCase("en")}| ${record.ledgerAccount.toLocaleLowerCase("en")}`;
      if (seen.has(key)) { duplicatesInFile++; return; }
      seen.add(key);
      prepared.push({ ...record, source: "Manufacturer List CSV" });
    });
    if (!prepared.length) return res.status(400).json({ message: "No valid manufacturer records found.", invalid, duplicatesInFile, errors });
    const existing = await Manufacturer.find({ $or: prepared.map((item) => ({ cCode: item.cCode, ledgerAccount: item.ledgerAccount })) }).collation({ locale: "en", strength: 2 }).select("cCode ledgerAccount").lean();
    const existingKeys = new Set(existing.map((item) => `${item.cCode.toLocaleLowerCase("en")}| ${item.ledgerAccount.toLocaleLowerCase("en")}`));
    const fresh = prepared.filter((item) => !existingKeys.has(`${item.cCode.toLocaleLowerCase("en")}| ${item.ledgerAccount.toLocaleLowerCase("en")}`));
    const skippedExisting = prepared.length - fresh.length;
    let inserted = 0;
    if (fresh.length) {
      const result = await Manufacturer.insertMany(fresh, { ordered: false });
      inserted = result.length;
    }
    return res.status(200).json({ message: "Manufacturer list import completed.", totalRows: rows.length, imported: inserted, skippedExisting, duplicatesInFile, invalid, errors });
  } catch (error) {
    console.error("BULK IMPORT MANUFACTURERS ERROR:", error);
    return res.status(500).json({ message: "Unable to import manufacturer list." });
  }
};
