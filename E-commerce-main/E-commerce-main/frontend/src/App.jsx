import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './routes/PrivateRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import ProductDetail from './pages/customer/ProductDetail';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderHistory from './pages/customer/OrderHistory';
import Wishlist from './pages/customer/Wishlist';
import ProfilePage from './pages/customer/ProfilePage';

// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard';
import VendorProducts from './pages/vendor/ProductsManagement';
import VendorAddProduct from './pages/vendor/AddProduct';
import VendorEditProduct from './pages/vendor/EditProduct';
import VendorOrders from './pages/vendor/Orders';
import VendorInventory from './pages/vendor/Inventory';
import VendorPayouts from './pages/vendor/Payouts';
import VendorReviews from './pages/vendor/Reviews';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminVendors from './pages/admin/VendorApprovals';
import AdminOrders from './pages/admin/AllOrders';
import AdminAnalytics from './pages/admin/Analytics';

// Common Pages
import ChatInterface from './pages/common/ChatInterface';
import NotFound from './pages/common/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Customer Routes */}
                <Route element={<PrivateRoute allowedRoles={['customer', 'vendor', 'admin']} />}>
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/chat" element={<ChatInterface />} />
                </Route>

                {/* Vendor Routes */}
                <Route element={<PrivateRoute allowedRoles={['vendor']} />}>
                  <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                  <Route path="/vendor/products" element={<VendorProducts />} />
                  <Route path="/vendor/products/add" element={<VendorAddProduct />} />
                  <Route path="/vendor/products/edit/:id" element={<VendorEditProduct />} />
                  <Route path="/vendor/orders" element={<VendorOrders />} />
                  <Route path="/vendor/inventory" element={<VendorInventory />} />
                  <Route path="/vendor/payouts" element={<VendorPayouts />} />
                  <Route path="/vendor/reviews" element={<VendorReviews />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/vendors" element={<AdminVendors />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;