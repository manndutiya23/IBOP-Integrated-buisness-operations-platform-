import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusinessData } from "../context/BusinessDataContext";
import API from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";

function CreateSale() {
  const navigate = useNavigate();
  const { products } = useBusinessData();
  const { user } = useAuth();
  const role = user?.role;
  const [formData, setFormData] = useState({
    companyName: "",
    productId: products[0]?._id ?? products[0]?.id ?? "",
    quantity: 1,
    rate: products[0]?.price ?? 0,
    discount: 0,
    salesperson: "",
    date: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const total = Number(formData.quantity || 0) * Number(formData.rate || 0);
  const discountAmount = total * (Number(formData.discount || 0) / 100);
  const finalAmount = total - discountAmount;

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "productId") {
   const product = products.find((item) => item._id === value);

      setFormData((currentForm) => ({
        ...currentForm,
        productId: String(value),
        rate: product?.price ?? currentForm.rate,
      }));
      return;
    }

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

const handleSubmit = async (event) => {
  event.preventDefault();
  setErrorMessage("");

  const quantity = Number(formData.quantity || 0);
  const rate = Number(formData.rate || 0);
  const totalPrice = quantity * rate;
  const discount = Number(formData.discount || 0);
  const discountAmount = totalPrice * (discount / 100);
  const finalAmount = totalPrice - discountAmount;

  const payload = {
    companyName: formData.companyName.trim(),
    productId: String(formData.productId),
    quantity,
    rate,
    totalPrice,
    discount,
    finalAmount,
    salesperson: formData.salesperson.trim(),
    date: new Date(formData.date),
  };

  try {
    await API.post("/sales", payload);
    navigate("/sales");
  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
    setErrorMessage("Failed to create sale");
  }
};

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      {(role === "Sales" || role === "Management" || role === "Admin") && (
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20"
      >
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Sales</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Create sale</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-200 sm:col-span-2">
            <span>Company name</span>
            <select
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
              required
            >
              <option value="">Select Company</option>
              {[
                "Mahesh Pharma",
                "Apollo",
                "Sun Pharma",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-200">
            <span>Product</span>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
              required
            >
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} ({product.stock} in stock)
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-200">
            <span>Quantity</span>
            <input
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
              type="number"
              min="1"
              required
            />
          </label>

          <label className="space-y-2 text-sm text-slate-200">
            <span>Rate</span>
            <input
              name="rate"
              value={formData.rate}
              readOnly
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400 cursor-not-allowed"
              type="number"
              min="0"
              step="0.01"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-200">
            <span>Discount %</span>
            <input
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="0"
            />
          </label>
        </div>
              <label className="space-y-2 text-sm text-slate-200">
  <span>Salesperson</span>
  <input
    name="salesperson"
    value={formData.salesperson || ""}
    onChange={handleChange}
    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
    type="text"
    required
  />
</label>
<label className="space-y-2 text-sm text-slate-200">
  <span>Date</span>
  <input
    name="date"
    value={formData.date || ""}
    onChange={handleChange}
    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
    type="date"
    required
  />
</label>
        {errorMessage ? <p className="text-sm text-red-300">{errorMessage}</p> : null}

        <button
          type="submit"
          className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Save sale
        </button>
      </form>
      )}
      <aside className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
        <h3 className="text-lg font-semibold text-white">Preview</h3>
        <div className="space-y-3 text-sm text-slate-300">
          <div className="flex justify-between gap-4">
            <span>Total</span>
            <span className="text-white">Rs{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Discount</span>
            <span className="text-white">Rs-{discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4 border-t border-white/10 pt-3 text-base font-semibold">
            <span className="text-white">Final amount</span>
            <span className="text-emerald-300">Rs{finalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          Selected product stock will decrease automatically after saving.
        </div>
      </aside>
    </section>
  );
}

export default CreateSale;