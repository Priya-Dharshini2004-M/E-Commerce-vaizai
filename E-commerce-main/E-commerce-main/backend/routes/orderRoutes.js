const express = require('express');
const { 
  createOrder, 
  verifyPayment, 
  getMyOrders, 
  getOrderById,
  getVendorOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Vendor routes
router.get('/vendor/orders', protect, authorize('vendor'), getVendorOrders);
router.put('/:id/status', protect, authorize('vendor', 'admin'), updateOrderStatus);

module.exports = router;