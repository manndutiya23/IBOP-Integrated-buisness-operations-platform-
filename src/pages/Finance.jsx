import { useState } from "react";
import { useBusinessData } from "../context/BusinessDataContext";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";


function Finance() {

  const {
    expenses,
    sales,
    invoices,
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
  const unpaidInvoices = invoices.filter(
  (invoice) => invoice.status === "unpaid"
);

const paidInvoices = invoices.filter(
  (invoice) => invoice.status === "paid"
);

const pendingPayments = unpaidInvoices.reduce(
  (sum, invoice) => sum + (invoice.finalAmount || 0),
  0
);

const totalGSTCollected = invoices.reduce(
  (sum, invoice) => sum + (invoice.gst || 0),
  0
);

const averageInvoiceValue =
  invoices.length > 0
    ? totalRevenue / invoices.length
    : 0;

 const categoryTotals = {};

expenses.forEach((expense) => {
  const category = expense.category || "Other";

  if (!categoryTotals[category]) {
    categoryTotals[category] = 0;
  }

  categoryTotals[category] += expense.amount;
});

const expenseCategoryData = Object.entries(categoryTotals).map(
  ([name, value]) => ({
    name,
    value,
  })
);

const COLORS = [
  "#34d399", // emerald
  "#facc15", // yellow
  "#60a5fa", // blue
  "#f87171", // red
  "#a78bfa", // purple
  "#fb923c", // orange
];

const financeComparisonData = [
  {
    name: "Finance",
    Revenue: totalRevenue,
    Expenses: totalExpenses,
  },
];



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.title || !form.amount || !form.date) return;

  try {
    await addExpense({
      title: form.title,
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
    });

    alert("Expense added");

    setForm({
      title: "",
      amount: "",
      category: "Other",
      date: "",
    });

  } catch (err) {
    console.error(err);
    alert("Failed to add expense");
  }
};
  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">

 {(role === "Finance" || role === "Management") && (

      <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/10">
        <h2 className="text-2xl text-white">Add Expense</h2>

        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full p-3 bg-slate-900 rounded-xl" required />

        <input name="amount" value={form.amount} onChange={handleChange} type="number" placeholder="Amount" className="w-full p-3 bg-slate-900 rounded-xl" required />

        <select name="category" value={form.category} onChange={handleChange} className="w-full p-3 bg-slate-900 rounded-xl">
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

      {/* ANALYTICS */}
<div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

  <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
    <p className="text-slate-400 text-sm">Total Revenue</p>
    <h3 className="text-2xl font-bold text-emerald-400">
      ₹{totalRevenue.toLocaleString()}
    </h3>
  </div>

  <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
    <p className="text-slate-400 text-sm">Total Expenses</p>
    <h3 className="text-2xl font-bold text-white">
      ₹{totalExpenses.toLocaleString()}
    </h3>
  </div>

  <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
    <p className="text-slate-400 text-sm">Profit</p>

    <h3
      className={`text-2xl font-bold ${
        profit >= 0
          ? "text-emerald-400"
          : "text-red-400"
      }`}
    >
      ₹{profit.toLocaleString()}
    </h3>
  </div>

  <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
    <p className="text-slate-400 text-sm">Pending Payments</p>

    <h3 className="text-2xl font-bold text-yellow-400">
      ₹{pendingPayments.toLocaleString()}
    </h3>

    <p className="text-xs text-slate-500 mt-1">
      {unpaidInvoices.length} unpaid invoices
    </p>
  </div>

  <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
    <p className="text-slate-400 text-sm">GST Collected</p>

    <h3 className="text-2xl font-bold text-cyan-400">
      ₹{totalGSTCollected.toLocaleString()}
    </h3>
  </div>

  <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
    <p className="text-slate-400 text-sm">Avg Invoice Value</p>

    <h3 className="text-2xl font-bold text-white">
      ₹{averageInvoiceValue.toFixed(2)}
    </h3>
  </div>

</div>

<div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">

  {/* PIE CHART */}
  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
    <h3 className="text-xl text-white mb-4">
      Expense Categories
    </h3>

    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>

          <Pie
  data={expenseCategoryData}
  dataKey="value"
  nameKey="name"
  outerRadius={100}
  label={({ name, percent }) =>
    `${name} ${(percent * 100).toFixed(0)}%`
  }
>
  {expenseCategoryData.map((entry, index) => (
    <Cell
      key={index}
      fill={COLORS[index % COLORS.length]}
    />
  ))}
</Pie>

          <Tooltip />
          <legend />

        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* BAR CHART */}
  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
    <h3 className="text-xl text-white mb-4">
      Revenue vs Expenses
    </h3>

    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">

        <BarChart data={financeComparisonData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />

          <XAxis dataKey="name" stroke="#aaa" />

          <YAxis stroke="#aaa" />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="Revenue"
            fill="#34d399"
            radius={[8, 8, 0, 0]}
          />

          <Bar
            dataKey="Expenses"
            fill="#f87171"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>
    </div>
  </div>

</div>
    </section>
  );
}

export default Finance;