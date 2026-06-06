const Review = require('../models/Review');
const Product = require('../models/Product');

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const existing = await Review.findOne({ productId, userId: req.user.id });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this product' });
    const review = await Review.create({
      productId,
      userId: req.user.id,
      userName: req.user.name,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVendorReviews = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user.id }).select('_id');
    const productIds = products.map(p => p._id);
    const reviews = await Review.find({ productId: { $in: productIds } }).sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProductReviews, addReview, getVendorReviews };