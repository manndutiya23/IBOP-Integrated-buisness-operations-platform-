import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["Admin", "Supply Chain", "Management", "Finance", "Sales", "HR"],
      required: true,
    },
    department: { type: String, required: true, trim: true },
    salary: { type: Number, required: true, min: 0 },
    phone: { type: String, required: true, trim: true },
    joiningDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
