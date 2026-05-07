import { useState } from "react";
import { useBusinessData } from "../context/BusinessDataContext";
import { Link } from "react-router-dom";
import axios from "axios";

function Finance() {

  const {
    expenses,
    addExpense,
    totalRevenue,
    totalExpenses,
    profit,
    role,
  } = useBusinessData();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Other",
    date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
if (!form.title || !form.amount || !form.date) return;
try {
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.title || !form.amount || !form.date) return;

  await addExpense({
    title: form.title,
    amount: Number(form.amount),
    category: form.category,
    date: form.date,
  });

  setForm({ title: "", amount: "", category: "Other", date: "" });
};

  alert("Expense added");

} catch (err) {
  console.error(err);
  alert("Failed to add expense");
}

    setForm({ title: "", amount: "", category: "Other", date: "" });
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">

 {(role === "Finance" || role === "Management") && (

      <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/10">
        <h2 className="text-2xl text-white">Add Expense</h2>

        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-3 bg-slate-900 rounded-xl" required />

        <input name="amount" value={form.amount} onChange={handleChange} type="number" placeholder="Amount" className="w-full p-3 bg-slate-900 rounded-xl" required />

        <select name="category" value={form.category} onChange={handleChange} className="w-full p-3 bg-slate-900 rounded-xl">
          <option>Purchase</option>
          <option>Salaries</option>
          <option>Other</option>
        </select>

        <input name="date" value={form.date} onChange={handleChange} type="date" className="w-full p-3 bg-slate-900 rounded-xl" required />

        <button className="bg-emerald-400 px-5 py-2 rounded-full text-black">
          Add Expense
        </button>
      </form>
 )}

      <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl text-white">Recent Expenses</h3>
          <Link to="/expenses" className="text-emerald-300 transition hover:text-emerald-200">
            View All Expenses →
          </Link>
        </div>

        {expenses.length === 0 ? (
          <p className="text-slate-400">No expenses yet</p>
        ) : (
          <div className="space-y-3">
            {expenses.slice(0, 3).map((expense, index) => (
              <div
                key={expense._id ?? `${expense.title}-${index}`}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
              >
                <p className="text-white">{expense.title}</p>
                <p className="text-sm text-slate-300">Amount: ₹{expense.amount}</p>
                <p className="text-sm text-slate-300">Category: {expense.category}</p>
                <p className="text-sm text-slate-300">Date: {expense.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

  <Link to="/expenses" className="text-emerald-300">
  View All Expenses →
</Link>
      {/* SUMMARY */}
      <div className="lg:col-span-2 grid grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-white/5 rounded-xl">
          <p>Total Sales</p>
          <h3>₹{totalRevenue.toLocaleString()}</h3>
        </div>

        <div className="p-4 bg-white/5 rounded-xl">
          <p>Total Expenses</p>
          <h3>₹{totalExpenses.toLocaleString()}</h3>
        </div>

        <div className="p-4 bg-white/5 rounded-xl">
          <p>Profit</p>
          <h3 className={profit >= 0 ? "text-green-400" : "text-red-400"}>
            ₹{profit.toLocaleString()}
          </h3>
        </div>
      </div>

    </section>
  );
}

export default Finance;