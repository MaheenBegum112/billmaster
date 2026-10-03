import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './layouts/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AccessDeniedPage from './pages/AccessDeniedPage';

// Authenticated Pages
import DashboardPage from './pages/DashboardPage';
import POSPage from './pages/POSPage';
import BillsPage from './pages/BillsPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import ReportsPage from './pages/ReportsPage';
import SmartRestockPage from './pages/SmartRestockPage';
import AnomalyDetectionPage from './pages/AnomalyDetectionPage';
import DemandForecastPage from './pages/DemandForecastPage';
import AIDashboardPage from './pages/AIDashboardPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import InAppAboutPage from './pages/InAppAboutPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Marketing & Information Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Access Denied Route */}
            <Route path="/access-denied" element={<AccessDeniedPage />} />

            {/* Authenticated Staff & Admin Application Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Shared Routes (Both Admin & Cashier) */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/pos" element={<POSPage />} />
              <Route path="/bills" element={<BillsPage />} />
              <Route path="/bills/:id" element={<BillsPage />} />
              <Route path="/app/about" element={<InAppAboutPage />} />

              {/* Strict Admin-Only Routes */}
              <Route
                path="/products"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <InventoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />

              {/* AI Decision Engines (Admin Only) */}
              <Route
                path="/ai"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AIDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai/smart-restock"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SmartRestockPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai/restock"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SmartRestockPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai/anomalies"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AnomalyDetectionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai/forecast"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <DemandForecastPage />
                  </ProtectedRoute>
                }
              />

              {/* System Admin Modules */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
