const express = require('express');
const { getVendors, approveVendor, getDashboardStats, toggleUserActive } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Enforce admin RBAC on all admin routes
router.use(protect, authorize('admin'));

router.get('/vendors', getVendors);
router.put('/vendors/:id/approve', approveVendor);
router.get('/stats', getDashboardStats);
router.put('/users/:id/toggle-active', toggleUserActive);

module.exports = router;
