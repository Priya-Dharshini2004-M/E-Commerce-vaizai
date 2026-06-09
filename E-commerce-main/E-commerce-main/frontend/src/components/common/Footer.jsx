import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiMail, FiPhone } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                MultiVendor
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India's premium multi-vendor marketplace. Discover thousands of curated products from trusted local creators and enterprises.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 rounded-lg text-slate-400 hover:text-white transition-all duration-300">
                <FiTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 rounded-lg text-slate-400 hover:text-white transition-all duration-300">
                <FiInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 rounded-lg text-slate-400 hover:text-white transition-all duration-300">
                <FiGithub className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 md:col-start-6 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-100">Shop & Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-100">Legal & Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-100">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center space-x-2">
                <FiMail className="w-4 h-4 text-indigo-400" />
                <a href="mailto:support@multivendor.com" className="hover:text-indigo-400 transition-colors">support@multivendor.com</a>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4 text-indigo-400" />
                <a href="tel:+919876543210" className="hover:text-indigo-400 transition-colors">+91 98765 43210</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} MultiVendor. Created with care.</p>
          <div className="flex space-x-6">
            <span className="hover:text-slate-400 cursor-default transition-colors">Security Guarded</span>
            <span className="hover:text-slate-400 cursor-default transition-colors">PCI Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;