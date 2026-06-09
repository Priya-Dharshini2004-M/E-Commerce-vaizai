import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { 
  FiMenu, 
  FiX, 
  FiShoppingCart, 
  FiUser, 
  FiChevronDown, 
  FiLogOut, 
  FiHeart, 
  FiPackage, 
  FiLayout, 
  FiSettings, 
  FiHelpCircle 
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cartCount = cart?.items?.length || 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Generate unique initial avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const navLinks = (
    <>
      <Link 
        to="/products" 
        className={`relative py-2 text-sm font-medium transition-colors duration-200 ${
          isActive('/products') 
            ? 'text-indigo-600 font-semibold' 
            : 'text-slate-600 hover:text-indigo-600'
        }`}
      >
        Products
        {isActive('/products') && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
        )}
      </Link>
      {user && (
        <Link 
          to="/orders" 
          className={`relative py-2 text-sm font-medium transition-colors duration-200 ${
            isActive('/orders') 
              ? 'text-indigo-600 font-semibold' 
              : 'text-slate-600 hover:text-indigo-600'
          }`}
        >
          My Orders
          {isActive('/orders') && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
          )}
        </Link>
      )}
      <Link 
        to="/chat" 
        className={`relative py-2 text-sm font-medium transition-colors duration-200 ${
          isActive('/chat') 
            ? 'text-indigo-600 font-semibold' 
            : 'text-slate-600 hover:text-indigo-600'
        }`}
      >
        Support
        {isActive('/chat') && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
        )}
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              MultiVendor
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {navLinks}
            </div>
            
            <div className="flex items-center space-x-4 border-l border-slate-100 pl-6">
              {/* Cart Icon */}
              <Link 
                to="/cart" 
                className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-50"
              >
                <FiShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm ring-2 ring-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Vendor Dropdown */}
              {user?.role === 'vendor' && (
                <div 
                  className="relative" 
                  onMouseEnter={() => setVendorDropdownOpen(true)}
                  onMouseLeave={() => setVendorDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-indigo-600 py-2 transition-colors">
                    <span>Vendor</span>
                    <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${vendorDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {vendorDropdownOpen && (
                    <div className="absolute right-0 mt-0 w-52 bg-white rounded-xl shadow-xl py-2 z-10 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link to="/vendor/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <FiLayout className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link to="/vendor/products" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <FiPackage className="w-4 h-4" /> Products
                      </Link>
                      <Link to="/vendor/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <FiShoppingCart className="w-4 h-4" /> Orders
                      </Link>
                      <Link to="/vendor/inventory" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <FiSettings className="w-4 h-4" /> Inventory
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Admin Dropdown */}
              {user?.role === 'admin' && (
                <div 
                  className="relative" 
                  onMouseEnter={() => setAdminDropdownOpen(true)}
                  onMouseLeave={() => setAdminDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-indigo-600 py-2 transition-colors">
                    <span>Admin</span>
                    <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${adminDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {adminDropdownOpen && (
                    <div className="absolute right-0 mt-0 w-52 bg-white rounded-xl shadow-xl py-2 z-10 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <FiLayout className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link to="/admin/vendors" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <FiUser className="w-4 h-4" /> Vendors
                      </Link>
                      <Link to="/admin/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <FiShoppingCart className="w-4 h-4" /> All Orders
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* User Account Menu */}
              {user ? (
                <div 
                  className="relative" 
                  onMouseEnter={() => setUserDropdownOpen(true)}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <button className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 py-2 transition-colors focus:outline-none">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      {getInitials(user?.name)}
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <FiChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-0 w-56 bg-white rounded-xl shadow-xl py-2 z-10 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-slate-50 mb-1">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{user?.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <FiUser className="w-4 h-4 text-slate-400" /> My Profile
                      </Link>
                      <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <FiPackage className="w-4 h-4 text-slate-400" /> My Orders
                      </Link>
                      <Link to="/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                        <FiHeart className="w-4 h-4 text-slate-400" /> Wishlist
                      </Link>
                      <div className="border-t border-slate-50 mt-1 pt-1">
                        <button 
                          onClick={handleLogout} 
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link 
              to="/cart" 
              className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors rounded-full"
            >
              <FiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[9px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center shadow-sm ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white py-4 px-4 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            <Link 
              to="/products" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
            >
              Products
            </Link>
            {user && (
              <Link 
                to="/orders" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              >
                My Orders
              </Link>
            )}
            <Link 
              to="/chat" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
            >
              Support
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-4">
            {user?.role === 'vendor' && (
              <div className="space-y-1 mb-4">
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vendor Management</p>
                <Link to="/vendor/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Dashboard</Link>
                <Link to="/vendor/products" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Products</Link>
                <Link to="/vendor/orders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Orders</Link>
              </div>
            )}
            {user?.role === 'admin' && (
              <div className="space-y-1 mb-4">
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin Panel</p>
                <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Dashboard</Link>
                <Link to="/admin/vendors" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Vendors</Link>
                <Link to="/admin/orders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Orders</Link>
              </div>
            )}

            {user ? (
              <div className="space-y-1">
                <div className="px-3 py-2 mb-2 flex items-center space-x-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold">
                    {getInitials(user?.name)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{user?.name}</h4>
                    <p className="text-xs text-slate-500 truncate max-w-[180px]">{user?.email}</p>
                  </div>
                </div>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">My Profile</Link>
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50">Wishlist</Link>
                <button 
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }} 
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50 mt-2"
                >
                  <FiLogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 px-3">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;