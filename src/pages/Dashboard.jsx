import { Link } from "react-router-dom";
import { useBusinessData } from "../context/BusinessDataContext";
import { useAuth } from "../context/AuthContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function Dashboard() {
  const {
    totalProducts,
      totalSales,
     totalRevenue,
      lowStockProducts,
      sales,
  } = useBusinessData();
  const { user } = useAuth();
  const role = user?.role;

  const modules = [
    { name: "Sales", path: "/sales-module",  roles: ["Sales", "Management", "Admin"], description: "Track orders and create new sales" },
    { name: "Finance", path: "/finance-module", roles: ["Finance", "Management", "Admin"], description: "Manage financial records and reports" },
    { name: "Supply chain", path: "/supply-chain", roles: ["Supply Chain", "Management", "Admin"], description: "Manage supply chain operations" },
    { name: "HR", path: "/hr-module", roles: ["HR", "Admin"], description: "Manage human resources" },
  ];

  const monthlyDataMap = {};

sales.forEach((sale) => {
  const date = new Date(sale.date);

  const month = date.toLocaleString("default", {
    month: "short",
  });

  if (!monthlyDataMap[month]) {
    monthlyDataMap[month] = {
      month,
      revenue: 0,
      sales: 0,
    };
  }

  monthlyDataMap[month].revenue += sale.finalAmount || 0;
  monthlyDataMap[month].sales += 1;
});

const chartData = Object.values(monthlyDataMap);

  return (
    <div>
      <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-8 shadow-2xl shadow-emerald-950/20">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Overview</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">IBOP dashboard</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          Jump into sales or inventory from one place. Everything runs in local React state for now.
        </p>
      </div>
      
<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-8">
  
  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
    <p className="text-sm text-slate-400">Total Products</p>
    <h3 className="text-2xl font-semibold text-white">{totalProducts}</h3>
  </div>

  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
    <p className="text-sm text-slate-400">Total Sales</p>
    <h3 className="text-2xl font-semibold text-white">{totalSales}</h3>
  </div>

  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
    <p className="text-sm text-slate-400">Total Revenue</p>
    <h3 className="text-2xl font-semibold text-emerald-300">
      ₹{totalRevenue.toFixed(2)}
    </h3>
  </div>

  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
    <p className="text-sm text-slate-400">Low Stock Items</p>
    <h3 className="text-2xl font-semibold text-red-300">
      {lowStockProducts.length}
    </h3>
  </div>

</div>
      <div className="grid lg:grid-cols-3 gap-6 mt-6">

  {/* LEFT SIDE - MODULES */}
  <div className="lg:col-span-2 grid gap-5 sm:grid-cols-2">
  {modules
  .filter((mod) => mod.roles.includes(role))
  .map((mod, index) => (
      <Link
        key={index}
        to={mod.path}
        className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/10"
      >
        <div className="flex h-full flex-col justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Module</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{mod.name}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{mod.description}</p>
          </div>

          <span className="text-sm font-medium text-emerald-300 group-hover:text-emerald-200">
            Open module →
          </span>
        </div>
      </Link>
    ))}
  </div>

 {/* RIGHT SIDE - ANALYTICS */}
<div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">

  <div className="flex items-center justify-between mb-6">
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
        Analytics
      </p>

      <h3 className="text-2xl font-semibold text-white mt-2">
        Revenue Trends
      </h3>
    </div>

    <div className="text-right">
      <p className="text-xs text-slate-400">
        Total Revenue
      </p>

      <p className="text-xl font-bold text-emerald-300">
        ₹{totalRevenue.toLocaleString()}
      </p>
    </div>
  </div>

  <div className="h-[260px]">

    <ResponsiveContainer width="100%" height="100%">

      <LineChart data={chartData}>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#1e293b"
        />

        <XAxis
          dataKey="month"
          stroke="#94a3b8"
        />

        <YAxis stroke="#94a3b8" />

        <Tooltip />

        <Legend />

        <Line
  type="monotone"
  dataKey="revenue"
  stroke="#34d399"
  strokeWidth={4}
  activeDot={{ r: 8 }}
  dot={{ r: 4 }}
/>

      </LineChart>

    </ResponsiveContainer>

  </div>

  {/* LOW STOCK QUICK PANEL */}
  <div className="mt-6 border-t border-white/10 pt-4">

    <div className="flex items-center justify-between">
      <h4 className="text-sm font-semibold text-white">
        Low Stock Products
      </h4>

      <span className="text-sm text-red-300">
        {lowStockProducts.length} items
      </span>
    </div>

    {lowStockProducts.length === 0 ? (
      <p className="mt-2 text-sm text-slate-400">
        Inventory levels are healthy.
      </p>
    ) : (
      <div className="mt-3 space-y-2">
        {lowStockProducts.slice(0, 3).map((product) => (
          <div
            key={product._id}
            className="flex items-center justify-between rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2"
          >
            <span className="text-sm text-white">
              {product.name}
            </span>

            <span className="text-sm font-semibold text-red-300">
              {product.stock}
            </span>
          </div>
        ))}
      </div>
    )}

  </div>

</div>

      </div>
    </div>
  );
}

export default Dashboard;