import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import HR from "./pages/HR";
import Products from "./pages/Products";
import CreateSale from "./pages/CreateSale";
import { BusinessDataProvider } from "./context/BusinessDataProvider";
import Finance from "./pages/Finance";

import Expenses from "./pages/Expenses";
import Employees from "./pages/Employees";
import SalesModule from "./pages/SalesModule";
import FinanceModule from "./pages/FinanceModule";
import HRModule from "./pages/HRModule";
import Invoices from "./pages/Invoices";
import Purchases from "./pages/Purchases";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import DesignSystem from "./pages/DesignSystem";
import AppShell from "./layouts/AppShell";

function AppContent() {
const { user, logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={(
            <ProtectedRoute>
              <AppShell user={user} logout={logout} />
            </ProtectedRoute>
          )}
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales-module" element={<ProtectedRoute allowedRoles={["Sales", "Management", "Admin"]}><SalesModule /></ProtectedRoute>} />
          <Route path="/sales" element={<ProtectedRoute allowedRoles={["Sales", "Management", "Admin"]}><Sales /></ProtectedRoute>} />
          <Route path="/sales/new" element={<ProtectedRoute allowedRoles={["Sales", "Management", "Admin"]}><CreateSale /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute allowedRoles={["Supply Chain", "Management", "Admin"]}><Products /></ProtectedRoute>} />
          <Route path="/hr-module" element={<ProtectedRoute allowedRoles={["HR", "Admin"]}><HRModule /></ProtectedRoute>} />
          
         
          <Route path="/purchases" element={<ProtectedRoute allowedRoles={["Supply Chain", "Management", "Admin"]}><Purchases /></ProtectedRoute>} />
          <Route path="/finance-module" element={<ProtectedRoute allowedRoles={["Finance", "Management", "Admin"]}><FinanceModule /></ProtectedRoute>} />
          <Route path="/finance" element={<ProtectedRoute allowedRoles={["Finance", "Management", "Admin"]}><Finance /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute allowedRoles={["Finance", "Management", "Admin"]}><Expenses /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute allowedRoles={["Finance", "Management", "Admin"]}><Invoices /></ProtectedRoute>} />
          <Route path="/design-system" element={<ProtectedRoute allowedRoles={["Management", "Admin"]}><DesignSystem /></ProtectedRoute>} />
          <Route path="/hr" element={<ProtectedRoute allowedRoles={["HR", "Admin"]}><HR /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute allowedRoles={["HR", "Admin"]}><Employees /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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