import { useState } from "react";
import { useBusinessData } from "../context/BusinessDataContext"; 
import { Link } from "react-router-dom";
import axios from "axios";

function Products() {
  const { products, addProduct, role } = useBusinessData();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    batchNumber: "",
    expiryDate: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
const res = await axios.post("http://localhost:5000/api/products", {
  name: formData.name.trim(),
  price: Number(formData.price),
  stock: Number(formData.stock),
  batchNumber: formData.batchNumber,
  expiryDate: formData.expiryDate,
});

// 🔥 update UI instantly
addProduct(res.data);

// reset form
setFormData({
  name: "",
  price: "",
  stock: "",
  batchNumber: "",
  expiryDate: "",
});

  } catch (error) {
    console.error(error);
    alert("Failed to add product");
  }
};

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20"
      >
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Inventory</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Products</h2>
        </div>

        <label className="block space-y-2 text-sm text-slate-200">
          <span>Name</span>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
            type="text"
            required
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 text-sm text-slate-200">
            <span>Price</span>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </label>

          <label className="block space-y-2 text-sm text-slate-200">
            <span>Stock quantity</span>
            <input
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
              type="number"
              min="0"
              step="1"
              required
            />
          </label>
          <label className="block space-y-2 text-sm text-slate-200">
  <span>Batch / LOT No</span>
  <input
    name="batchNumber"
    value={formData.batchNumber}
    onChange={handleChange}
    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
    type="text"
    required
  />
</label>

<label className="block space-y-2 text-sm text-slate-200">
  <span>Expiry Date</span>
  <input
    name="expiryDate"
    value={formData.expiryDate}
    onChange={handleChange}
    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
    type="date"
    required
  />
</label>
        </div>
{(role === "Management" || role === "Supply Chain") && (
        <button
          type="submit"
          className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Add product
        </button>
        )}
      </form>

      <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold tracking-tight text-white">Product Preview</h3>
          <Link to="/products/list" className="text-emerald-300 transition hover:text-emerald-200">
            View All Products →
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-slate-400">No products available</p>
        ) : (
          <div className="space-y-3">
            {products.slice(0, 3).map((product, index) => (
              <div
                key={product._id ?? `${product.name}-${index}`}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
              >
                <p className="text-base font-medium text-white">{product.name}</p>
                <p className="mt-1 text-sm text-slate-300">Price: ₹{product.price}</p>
                <p className="text-sm text-slate-300">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        )}
      </div>

<Link to="/products/list" className="text-emerald-300">
  View All Products →
</Link>
    </section>
  );
}

export default Products;