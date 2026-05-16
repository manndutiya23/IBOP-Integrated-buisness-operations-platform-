import Sale from "../models/Sale.js";
import Product from "../models/Product.js";

export const createSale = async (req, res) => {
  try {
    const {
      companyName,
      productId,
      quantity,
      rate,
      totalPrice,
      discount,
      finalAmount,
      salesperson,
      date,
    } = req.body;

    if (!companyName || !productId || !quantity || !salesperson) {
      return res.status(400).json({ message: "Missing required sale fields" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const numericQuantity = Number(quantity);
    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    if (product.stock < numericQuantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    const numericRate = Number.isFinite(Number(rate)) && Number(rate) > 0
      ? Number(rate)
      : Number(product.price);
    const numericTotalPrice = Number.isFinite(Number(totalPrice))
      ? Number(totalPrice)
      : numericQuantity * numericRate;
    const numericDiscount = Number.isFinite(Number(discount)) ? Number(discount) : 0;
    const discountAmount = numericTotalPrice * (numericDiscount / 100);
    // GST rate (18%) - this represents tax applied to the taxable amount (after discount)
    const GST_RATE = 0.18;
    const taxableAmount = numericTotalPrice - discountAmount;
    const gstAmount = taxableAmount * GST_RATE;
    const numericFinalAmount = taxableAmount + gstAmount;
    const saleDate = date ? new Date(date) : new Date();

    if (Number.isNaN(saleDate.getTime())) {
      return res.status(400).json({ message: "Invalid sale date" });
    }

    
    const sale = new Sale({
      
      companyName: companyName.trim(),
      productId,
      quantity: numericQuantity,
      rate: numericRate,
      totalPrice: numericTotalPrice,
      discount: numericDiscount,
      finalAmount: numericFinalAmount,
      salesperson: salesperson.trim(),
      date: saleDate,
    });

    await sale.save();

    product.stock -= numericQuantity;
    await product.save();

    res.status(201).json(sale);

  } catch (err) {
  console.error("REAL ERROR:", err);
    res.status(500).json({ message: "Error creating sale" });
  }
};

export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("productId");

    const formatted = sales.map((sale) => {
      const product = sale.productId;

      const rate = sale.rate ?? product?.price ?? 0;
      const total = sale.totalPrice ?? rate * sale.quantity;
      const discount = sale.discount ?? 0;
      const discountAmount = total * (discount / 100);
      const taxable = total - discountAmount;
      const gst = taxable * 0.18;
      const finalAmount = sale.finalAmount ?? taxable + gst;

      return {
        _id: sale._id,
        companyName: sale.companyName || "-",
        productName: product?.name || "N/A",
        quantity: sale.quantity,
        rate,
        totalPrice: total,
        discount,
        finalAmount,
        salesperson: sale.salesperson || "-",
        date: sale.date,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const product = await Product.findById(sale.productId);
    if (product) {
      product.stock += sale.quantity;
      await product.save();
    }

    res.json({ message: "Sale deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};