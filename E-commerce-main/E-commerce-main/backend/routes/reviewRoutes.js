const express = require('express');
const { getProductReviews, addReview, getVendorReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', protect, addReview);
router.get('/vendor/reviews', protect, authorize('vendor'), getVendorReviews);

module.exports = router;