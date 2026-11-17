import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: "General" },
  date: { type: Date, default: Date.now },
  purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Purchase", default: null },
  receiptId: { type: mongoose.Schema.Types.ObjectId, default: null },
  supplierName: { type: String, trim: true },
}, { timestamps: true });

// One finance expense per goods-receipt event; prevents duplicate posting on retries.
expenseSchema.index({ purchaseId: 1, receiptId: 1 }, { unique: true, partialFilterExpression: { purchaseId: { $type: "objectId" }, receiptId: { $type: "objectId" } } });

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
