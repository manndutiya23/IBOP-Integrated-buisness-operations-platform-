import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },

    supplierName: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    purchasePrice: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    gst: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
    },

    batchNumber: String,

    expiryDate: Date,

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Purchase", purchaseSchema);