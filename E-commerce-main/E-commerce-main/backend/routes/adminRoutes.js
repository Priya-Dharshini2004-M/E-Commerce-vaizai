const express = require('express');
const { getVendors, approveVendor, getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(protect, authorize('admin'));
router.get('/vendors', getVendors);
router.put('/vendors/:id/approve', approveVendor);
router.get('/stats', getDashboardStats);

module.exports = router;