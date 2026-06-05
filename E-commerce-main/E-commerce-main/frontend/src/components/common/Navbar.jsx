import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiChevronDown } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cartCount = cart?.items?.length || 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = (
    <>
      <Link to="/products" className="text-gray-700 hover:text-blue-600 transition">Products</Link>
      {user && <Link to="/orders" className="text-gray-700 hover:text-blue-600">My Orders</Link>}
      <Link to="/chat" className="text-gray-700 hover:text-blue-600">Support</Link>
    </>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MultiVendor
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks}
            
            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <FiShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Vendor Dropdown (if vendor) */}
            {user?.role === 'vendor' && (
              <div className="relative" onMouseLeave={() => setVendorDropdownOpen(false)}>
                <button
                  onMouseEnter={() => setVendorDropdownOpen(true)}
                  className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
                >
                  Vendor <FiChevronDown className="w-4 h-4" />
                </button>
                {vendorDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                    <Link to="/vendor/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                    <Link to="/vendor/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Products</Link>
                    <Link to="/vendor/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                    <Link to="/vendor/inventory" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Inventory</Link>
                    <Link to="/vendor/payouts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Payouts</Link>
                  </div>
                )}
              </div>
            )}

            {/* Admin Dropdown */}
            {user?.role === 'admin' && (
              <div className="relative" onMouseLeave={() => setAdminDropdownOpen(false)}>
                <button
                  onMouseEnter={() => setAdminDropdownOpen(true)}
                  className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
                >
                  Admin <FiChevronDown className="w-4 h-4" />
                </button>
                {adminDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                    <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                    <Link to="/admin/vendors" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Vendors</Link>
                    <Link to="/admin/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">All Orders</Link>
                    <Link to="/admin/analytics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Analytics</Link>
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative" onMouseLeave={() => setUserDropdownOpen(false)}>
                <button
                  onMouseEnter={() => setUserDropdownOpen(true)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                >
                  <FiUser className="w-5 h-5" />
                  <span>{user.name.split(' ')[0]}</span>
                  <FiChevronDown className="w-4 h-4" />
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Wishlist</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t space-y-3">
            {navLinks}
            <Link to="/cart" className="flex items-center gap-2">Cart ({cartCount})</Link>
            {user?.role === 'vendor' && (
              <>
                <Link to="/vendor/dashboard" className="block">Vendor Dashboard</Link>
                <Link to="/vendor/products" className="block">My Products</Link>
                <Link to="/vendor/orders" className="block">Vendor Orders</Link>
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" className="block">Admin Dashboard</Link>
                <Link to="/admin/vendors" className="block">Manage Vendors</Link>
              </>
            )}
            {user ? (
              <>
                <Link to="/profile" className="block">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left text-red-600">Logout</button>
              </>
            ) : (
              <div className="flex space-x-3 pt-2">
                <Link to="/login" className="text-blue-600">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-3 py-1 rounded">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;