import { useState } from "react";
import { useBusinessData } from "../context/BusinessDataContext";

function Purchases() {

  const {
    purchases,
    createPurchase,
  } = useBusinessData();

  const [form, setForm] = useState({
    productName: "",
    supplierName: "",
    quantity: "",
    purchasePrice: "",
    gst: 18,
    batchNumber: "",
    expiryDate: "",
    date: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await createPurchase({
        ...form,
        quantity: Number(form.quantity),
        purchasePrice: Number(form.purchasePrice),
        gst: Number(form.gst),
      });

      alert("Purchase created successfully");

      setForm({
        productName: "",
        supplierName: "",
        quantity: "",
        purchasePrice: "",
        gst: 18,
        batchNumber: "",
        expiryDate: "",
        date: "",
      });

    } catch (error) {
      console.error(error);

      alert("Failed to create purchase");
    }
  };

  return (
    <section className="space-y-6">

      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
          Supply Chain
        </p>

        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Purchases
        </h2>
      </div>

      {/* PURCHASE FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2"
      >

        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={form.productName}
          onChange={handleChange}
          className="rounded-xl bg-slate-900 p-3 text-white"
          required
        />

        <input
          type="text"
          name="supplierName"
          placeholder="Supplier Name"
          value={form.supplierName}
          onChange={handleChange}
          className="rounded-xl bg-slate-900 p-3 text-white"
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="rounded-xl bg-slate-900 p-3 text-white"
          required
        />

        <input
          type="number"
          name="purchasePrice"
          placeholder="Purchase Price"
          value={form.purchasePrice}
          onChange={handleChange}
          className="rounded-xl bg-slate-900 p-3 text-white"
          required
        />

        <input
          type="number"
          name="gst"
          placeholder="GST %"
          value={form.gst}
          onChange={handleChange}
          className="rounded-xl bg-slate-900 p-3 text-white"
        />

        <input
          type="text"
          name="batchNumber"
          placeholder="Batch Number"
          value={form.batchNumber}
          onChange={handleChange}
          className="rounded-xl bg-slate-900 p-3 text-white"
        />

        <input
          type="date"
          name="expiryDate"
          placeholder="Expiry Date"
          value={form.expiryDate}
          onChange={handleChange}
          className="rounded-xl bg-slate-900 p-3 text-white"
        />

        <input
          type="date"
          name="date"
          placeholder="Purchase Date"
          value={form.date}
          onChange={handleChange}
          className="rounded-xl bg-slate-900 p-3 text-white"
          required
        />

        <button
          type="submit"
          className="rounded-full bg-emerald-400 px-5 py-3 font-semibold text-black transition hover:bg-emerald-300"
        >
          Create Purchase
        </button>

      </form>

      {/* PURCHASE HISTORY */}
      <div className="space-y-4">

        {purchases.length === 0 ? (
          <p className="text-slate-400">
            No purchases yet
          </p>
        ) : (
          purchases.map((purchase) => (

            <div
              key={purchase._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {purchase.productName}
                  </h3>

                  <p className="text-sm text-slate-400">
                    Supplier: {purchase.supplierName}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-300">
                    ₹{purchase.finalAmount}
                  </p>

                  <p className="text-sm text-slate-400">
                    Qty: {purchase.quantity}
                  </p>
                </div>

              </div>

              <div className="mt-4 grid gap-2 text-sm text-slate-300 md:grid-cols-4">

                <p>
                  Batch: {purchase.batchNumber || "-"}
                </p>

                <p>
                  GST: {purchase.gst}%
                </p>

                <p>
                  Price: ₹{purchase.purchasePrice}
                </p>

                <p>
                  Expiry: {
                    purchase.expiryDate
                      ? new Date(purchase.expiryDate).toLocaleDateString()
                      : "-"
                  }
                </p>

              </div>

            </div>
          ))
        )}

      </div>

    </section>
  );
}

export default Purchases;