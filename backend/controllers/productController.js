import Product from "../models/Product.js";

// GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE product
export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, batchNumber, expiryDate } = req.body;

    const product = new Product({
      name,
      price,
      stock,
      batchNumber,
      expiryDate,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, batchNumber, expiryDate } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, stock, batchNumber, expiryDate },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};