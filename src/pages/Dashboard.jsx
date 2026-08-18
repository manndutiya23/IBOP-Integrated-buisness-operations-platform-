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
  } = useBusinessData();
  const { user } = useAuth();

  

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
<DashboardActivity />
 {/* RIGHT SIDE - ANALYTICS */}
<DashboardAnalytics />
<DashboardNotifications />

      </div>
    </div>
  );
}

export default Dashboard;