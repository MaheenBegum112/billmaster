import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BillingPage from "./pages/BillingPage";

import AdminLayout from "./pages/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import ProductPage from "./pages/ProductPage";
import AddProductPage from "./pages/AddProductPage";
import ReportsPage from "./pages/ReportsPage";
import LowStockPage from "./pages/LowStockPage";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/billing" element={<BillingPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="add-product" element={<AddProductPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="low-stock" element={<LowStockPage />} />
            
          </Route>

        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;