import mongoose from "mongoose";

const manufacturerSchema = new mongoose.Schema({
  cCode: { type: String, required: true, trim: true },
  ledgerAccount: { type: String, required: true, trim: true },
  city: { type: String, default: "" },
  area: { type: String, default: "" },
  add1: { type: String, default: "" },
  add2: { type: String, default: "" },
  state: { type: String, default: "" },
  status: { type: String, default: "" },
  pinCode: { type: String, default: "" },
  email: { type: String, default: "" },
  gstin: { type: String, default: "" },
  gstDate: { type: String, default: "" },
  salesman: { type: String, default: "" },
  cdPercent: { type: String, default: "" },
  contactPerson: { type: String, default: "" },
  telephone: { type: String, default: "" },
  mobile: { type: String, default: "" },
  sms: { type: String, default: "" },
  source: { type: String, default: "Manufacturer List" },
}, { timestamps: true, versionKey: false });

manufacturerSchema.index({ cCode: 1, ledgerAccount: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });
manufacturerSchema.index({ ledgerAccount: "text", city: "text", state: "text", gstin: "text", contactPerson: "text" });
export default mongoose.model("Manufacturer", manufacturerSchema);
