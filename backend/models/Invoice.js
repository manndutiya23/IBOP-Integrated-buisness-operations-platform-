import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sale",
    required: true
  },
  companyName: String,
  productName: String,
  quantity: Number,
  rate: Number,
  totalPrice: Number,
  discountPercent: Number,
  discountAmount: Number,
  finalAmount: Number,
  date: Date,
  subtotal: Number,
  gst: Number,
  status: {
    type: String,
    enum: ["paid", "unpaid"],
    default: "unpaid"
  },
  dueDate: Date,
}, { timestamps: true });

export default mongoose.model("Invoice", invoiceSchema);