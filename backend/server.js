import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";


dotenv.config();

const app = express();
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  : ["http://localhost:5173", "http://localhost:3000"];

// connect database - CRITICAL: Must await to ensure DB ready before routes process requests
await connectDB();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

// DEBUG: Log all registered routes
console.log("=== ROUTE REGISTRATION START ===");
app.use("/api/products", (req, res, next) => {
  console.log("📍 /api/products hit:", req.method, req.path);
  next();
}, productRoutes);
app.use("/api/expenses", (req, res, next) => {
  console.log("📍 /api/expenses hit:", req.method, req.path);
  next();
}, expenseRoutes);
app.use("/api/sales", (req, res, next) => {
  console.log("📍 /api/sales hit:", req.method, req.path);
  next();
}, saleRoutes);
app.use("/api/invoices", (req, res, next) => {
  console.log("📍 /api/invoices hit:", req.method, req.path);
  next();
}, invoiceRoutes);
app.use("/api/purchases", (req, res, next) => {
  console.log("📍 /api/purchases hit:", req.method, req.path);
  next();
}, purchaseRoutes);
app.use("/api/employees", (req, res, next) => {
  console.log("📍 /api/employees hit:", req.method, req.path);
  next();
}, employeeRoutes);
console.log("=== ROUTE REGISTRATION END ===");

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  
});