import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";
import Expense from "../models/Expense.js";


// CREATE PURCHASE
export const createPurchase = async (req, res) => {
  try {
    const {
      productName,
      supplierName,
      quantity,
      purchasePrice,
      gst,
      batchNumber,
      expiryDate,
      date,
    } = req.body;

    // calculations
    const totalAmount = quantity * purchasePrice;
    const gstAmount = (totalAmount * gst) / 100;
    const finalAmount = totalAmount + gstAmount;

    // save purchase
    const purchase = new Purchase({
      productName,
      supplierName,
      quantity,
      purchasePrice,
      totalAmount,
      gst,
      finalAmount,
      batchNumber,
      expiryDate,
      date,
    });

    await purchase.save();


  let product = await Product.findOne({
  name: { $regex: new RegExp(`^${productName}$`, "i") }
});

    if (product) {
      // increase stock
      product.stock += quantity;

      // update price
      product.price = purchasePrice;

      // optional updates
      product.batchNumber = batchNumber;
      product.expiryDate = expiryDate;

      await product.save();

    } else {
      // create new product automatically
      product = new Product({
        name: productName,
        price: purchasePrice,
        stock: quantity,
        batchNumber,
        expiryDate,
      });

      await product.save();
    }

    // auto-create finance expense entry
    const expense = new Expense({
      title: `Purchase - ${productName}`,
      amount: finalAmount,
      category: "Purchase",
      date,
    });

    await expense.save();

    res.status(201).json({
      message: "Purchase created successfully",
      purchase,
      product,
      expense,
    });

  } catch (error) {
    console.error("CREATE PURCHASE ERROR:", error);

    res.status(500).json({
      message: "Failed to create purchase",
    });
  }
};



// GET ALL PURCHASES
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });

    res.json(purchases);

  } catch (error) {
    console.error("GET PURCHASES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch purchases",
    });
  }
};