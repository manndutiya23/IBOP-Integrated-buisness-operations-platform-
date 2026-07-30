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
 <DashboardTables />

 {/* RIGHT SIDE - ANALYTICS */}
<DashboardAnalytics />

      </div>
    </div>
  );
}

export default Dashboard;