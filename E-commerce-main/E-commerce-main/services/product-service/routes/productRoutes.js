const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  createProductReview,
  getAIRecommendations,
  getInternalStats
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// General rate limiter for product details endpoints
const productLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 300,
  message: { message: 'Too many requests' }
});

router.route('/')
  .get(productLimiter, getProducts)
  .post(protect, authorize('vendor', 'admin'), createProduct);

router.get('/vendor/me', protect, authorize('vendor'), getMyProducts);
router.get('/recommendations', getAIRecommendations);
router.get('/internal/stats', getInternalStats);

router.route('/:id')
  .get(productLimiter, getProductById)
  .put(protect, authorize('vendor', 'admin'), updateProduct)
  .delete(protect, authorize('vendor', 'admin'), deleteProduct);

router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
