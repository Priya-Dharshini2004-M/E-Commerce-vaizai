const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected (any logged-in user can create – role check will be added later)
router.post('/', protect, createProduct);
router.get('/vendor/myproducts', protect, getMyProducts);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;