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
import Purchases from "./pages/Purchases";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function AppContent() {
const { user, logout } = useAuth();


const navItems = [
  { label: "Dashboard", path: "/", roles: ["Admin", "Management", "Sales", "Finance", "HR", "Supply Chain"] },
  { label: "Sales", path: "/sales-module", roles: ["Sales", "Management", "Admin"] },
  { label: "New Sale", path: "/sales/new", roles: ["Sales", "Management", "Admin"] },
  { label: "Supply Chain", path: "/supply-chain", roles: ["Supply Chain", "Management", "Admin"] },
  {label: "Product List",path: "/products/list",roles: ["Management", "Admin"]},
  {label: "Purchases",path: "/purchases",roles: ["Supply Chain", "Management", "Admin"]},
  { label: "Finance", path: "/finance-module", roles: ["Finance", "Management", "Admin"] },
  { label: "Expenses", path: "/expenses", roles: ["Finance", "Management", "Admin"] },
  { label: "HR", path: "/hr-module", roles: ["HR", "Management", "Admin"] },
  { label: "Employees", path: "/employees", roles: ["HR", "Management", "Admin"] },

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
    .filter(item => user && item.roles.includes(user.role))
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
{user && (
  <button
    onClick={logout}
    className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20"
  >
    Logout
  </button>
)}
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/login" element={<Login />} />
  <Route
  path="/"
  element={
    <ProtectedRoute>
      <Dashboard />

    </ProtectedRoute>
  }
/>
<Route
  path="/sales-module"
  element={
    <ProtectedRoute
      allowedRoles={[
        "Sales",
        "Management",
        "Admin",
      ]}
    >
      <SalesModule />
    </ProtectedRoute>
  }
/>
            <Route path="/sales" element={<ProtectedRoute allowedRoles={["Sales", "Management", "Admin"]}><Sales /></ProtectedRoute>} />
            <Route path="/sales/new" element={<ProtectedRoute allowedRoles={["Sales", "Management", "Admin"]}><CreateSale /></ProtectedRoute>} />
<Route
  path="/supply-chain"
  element={
    <ProtectedRoute
      allowedRoles={[
        "Supply Chain",
        "Management",
        "Admin",
      ]}
    >
      <SupplyChain />
    </ProtectedRoute>
  }
/>
      <Route
  path="/hr-module"
  element={
    <ProtectedRoute
      allowedRoles={[
        "HR",
        "Management",
        "Admin",
      ]}
    >
      <HRModule />
    </ProtectedRoute>
  }
/>
            <Route path="/products" element={<ProtectedRoute allowedRoles={["Supply Chain", "Management", "Admin"]}><Products /></ProtectedRoute>} />
          <Route path="/products/list" element={<ProtectedRoute allowedRoles={["Supply Chain", "Management", "Admin"]}><ProductList /></ProtectedRoute>} />
          <Route path="/purchases" element={<ProtectedRoute allowedRoles={["Supply Chain", "Management", "Admin"]}><Purchases /></ProtectedRoute  >} />
          <Route
  path="/finance-module"
  element={
    <ProtectedRoute
      allowedRoles={[
        "Finance",
        "Management",
        "Admin",
      ]}
    >
      <FinanceModule />
    </ProtectedRoute>
  }
/>
            <Route path="/finance" element={<ProtectedRoute allowedRoles={["Finance", "Management", "Admin"]}><Finance /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute allowedRoles={["Finance", "Management", "Admin"]}><Expenses /></ProtectedRoute>} />
            <Route path="/invoices" element={<ProtectedRoute allowedRoles={["Finance", "Management", "Admin"]}><Invoices /></ProtectedRoute>} />
            <Route path="/hr" element={<ProtectedRoute allowedRoles={["HR", "Management", "Admin"]}><HR /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute allowedRoles={["HR", "Management", "Admin"]}><Employees /></ProtectedRoute>} />
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