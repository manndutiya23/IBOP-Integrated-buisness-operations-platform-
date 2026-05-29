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

console.log("CORS allowed origins:", allowedOrigins);

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

console.log("Mounting routes...");
app.use("/api/products", productRoutes);
console.log("✓ /api/products mounted");
app.use("/api/expenses", expenseRoutes);
console.log("✓ /api/expenses mounted");
app.use("/api/sales", saleRoutes);
console.log("✓ /api/sales mounted");
app.use("/api/invoices", invoiceRoutes);
console.log("✓ /api/invoices mounted");
app.use("/api/purchases", purchaseRoutes);
console.log("✓ /api/purchases mounted");
app.use("/api/employees", employeeRoutes);
console.log("✓ /api/employees mounted");
console.log("All routes mounted successfully!");;

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Catch-all for any unmatched routes
app.use((req, res) => {
  console.log("❌ 404 - Path not found:", req.method, req.path);
  console.log("   Full URL:", req.originalUrl);
  console.log("   Headers:", req.headers);
  res.status(404).json({ 
    error: "Not Found",
    path: req.path,
    method: req.method,
    message: "Route not found. Check server logs for details."
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  
});