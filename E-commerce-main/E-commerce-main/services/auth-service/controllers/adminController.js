const User = require('../models/User');
const http = require('http');

// Helper to make internal API calls
const fetchServiceData = (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', (err) => {
      resolve(null); // Return null on error, don't crash
    });
  });
};

const getVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).select('-password');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveVendor = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);
    if (!vendor || vendor.role !== 'vendor') {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    vendor.vendorInfo = vendor.vendorInfo || {};
    vendor.vendorInfo.isApproved = true;
    await vendor.save();
    res.json({ message: 'Vendor approved', vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalVendors = await User.countDocuments({ role: 'vendor', 'vendorInfo.isApproved': true });
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Call order service for order & revenue statistics
    const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://order-service:5003';
    const orderStats = await fetchServiceData(`${orderServiceUrl}/api/orders/internal/stats`);

    // Call product service for product statistics
    const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://product-service:5002';
    const productStats = await fetchServiceData(`${productServiceUrl}/api/products/internal/stats`);

    res.json({
      totalVendors,
      totalCustomers,
      totalOrders: orderStats?.totalOrders || 0,
      totalRevenue: orderStats?.totalRevenue || 0,
      totalProducts: productStats?.totalProducts || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle status of user account (admin block/unblock)
const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot modify admin accounts' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User account ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVendors,
  approveVendor,
  getDashboardStats,
  toggleUserActive
};
