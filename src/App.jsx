import { BrowserRouter, Navigate, NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import HR from "./pages/HR";
import Products from "./pages/Products";
import CreateSale from "./pages/CreateSale";
import { BusinessDataProvider } from "./context/BusinessDataProvider";
import Finance from "./pages/Finance";
import { useBusinessData } from "./context/BusinessDataContext";
import ProductList from "./pages/ProductList";
import Expenses from "./pages/Expenses";
import Employees from "./pages/Employees";
import SupplyChain from "./pages/SupplyChain";
import SalesModule from "./pages/SalesModule";
import FinanceModule from "./pages/FinanceModule";
import HRModule from "./pages/HRModule";
import Invoices from "./pages/Invoices";

function AppContent() {
const { role, setRole } = useBusinessData();


const navItems = [
  { label: "Dashboard", path: "/", roles: ["Management", "Sales", "Finance", "HR"] },
  { label: "Sales", path: "/sales-module", roles: ["Sales", "Management"] },
  { label: "New Sale", path: "/sales/new", roles: ["Sales", "Management"] },
  { label: "Supply Chain", path: "/supply-chain", roles: ["Supply Chain", "Management"] },
  {label: "Product List",path: "/products/list",roles: ["Management"]},
  { label: "Finance", path: "/finance-module", roles: ["Finance", "Management"] },
  { label: "Expenses", path: "/expenses", roles: ["Finance", "Management"] },
  { label: "HR", path: "/hr-module", roles: ["HR", "Management"] },
  { label: "Employees", path: "/employees", roles: ["HR", "Management"] },

];
  return (
    <BrowserRouter>

      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Shrinath Enterprises</p>
              <h1 className="text-lg font-semibold text-white">Integrated Business Operations Platform (IBOP)</h1>
            </div>

<nav className="flex flex-wrap gap-2 text-sm font-medium">
  {navItems
    .filter(item => item.roles.includes(role))
    .map(({ label, path }) => (
      <NavLink
        key={path}
        to={path}
        end={path === "/"}
        className={({ isActive }) =>
          [
            "rounded-full border px-4 py-2 transition",
            isActive
              ? "border-emerald-400 bg-emerald-400/15 text-emerald-200"
              : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10",
          ].join(" ")
        }
      >
        {label}
      </NavLink>
    ))}
</nav>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-slate-900 border border-white/10 px-3 py-2 rounded-xl text-sm"
            >
              <option>Management</option>
              <option>Sales</option>
              <option>Finance</option>
              <option>HR</option>
              <option>Supply Chain</option>
            </select>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sales-module" element={<SalesModule />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/sales/new" element={<CreateSale />} />
            <Route path="/finance-module" element={<FinanceModule />} />
            <Route path="/supply-chain" element={<SupplyChain />} />
            <Route path="/hr-module" element={<HRModule />} />
            <Route path="/products" element={<Products />} />
          <Route path="/products/list" element={<ProductList />} />
            <Route
              path="/finance"
              element={
                role === "Finance" || role === "Management" ? (
                  <Finance />
                ) : (
                  <div>Access Denied</div>
                )
              }
            />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route
              path="/hr"
              element={
                role === "HR" || role === "Management" ? (
                  <HR />
                ) : (
                  <div>Access Denied</div>
                )
              }
              />
            <Route path="/employees" element={<Employees />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <BusinessDataProvider>
      <AppContent />
    </BusinessDataProvider>
  );
}

export default App;