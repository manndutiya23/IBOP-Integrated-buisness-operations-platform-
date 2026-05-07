import { Link } from "react-router-dom";
import { useBusinessData } from "../context/BusinessDataContext";

function Dashboard() {
  const {
    totalProducts,
      totalSales,
     totalRevenue,
      lowStockProducts,
      role
  } = useBusinessData();

  const modules = [
    { name: "Sales", path: "/sales-module",  roles: ["Sales", "Management"], description: "Track orders and create new sales" },
    { name: "Finance", path: "/finance-module", roles: ["Finance", "Management"], description: "Manage financial records and reports" },
    { name: "Supply chain", path: "/supply-chain", roles: ["Supply Chain", "Management"], description: "Manage supply chain operations" },
    { name: "HR", path: "/hr-module", roles: ["HR", "Management"], description: "Manage human resources" },
  ];

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

  {/* RIGHT SIDE - LOW STOCK PANEL */}
  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 h-fit">
    <h3 className="text-lg font-semibold text-white mb-4">
      ⚠️ Low Stock Products
    </h3>

    {lowStockProducts.length === 0 ? (
      <p className="text-slate-400">
        All products are sufficiently stocked.
      </p>
    ) : (
      <ul className="space-y-2">
        {lowStockProducts.map((product) => (
          <li
            key={product._id}
            className="flex justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/20"
          >
            <span>{product.name}</span>
            <span className="text-red-300 font-semibold">
              {product.stock}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>

</div>
    </div>
  );
}

export default Dashboard;