import { Link } from "react-router-dom";
import {
    DashboardHeader,
    DashboardKPIs,
    DashboardTables,
    DashboardAnalytics,
    DashboardActivity,
    DashboardNotifications,
} from "../components/dashboard";
import { useBusinessData } from "../context/BusinessDataContext";
import { useAuth } from "../context/AuthContext";


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

  

  return (
    <div className="ibop-page">
<DashboardHeader user={user} />
      
<DashboardKPIs
    totalProducts={totalProducts}
    totalSales={totalSales}
    totalRevenue={totalRevenue}
    lowStockProducts={lowStockProducts}
/>
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
<DashboardAnalytics />

      </div>
    </div>
  );
}

export default Dashboard;