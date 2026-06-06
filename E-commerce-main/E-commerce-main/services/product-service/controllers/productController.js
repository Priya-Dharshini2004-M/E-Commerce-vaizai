const Product = require('../models/Product');
const Review = require('../models/Review');
const Category = require('../models/Category');
const es = require('../utils/elasticsearch');

// @desc    Get all products (with optional filtering & search)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Elasticsearch integration with MongoDB fallback
    if (keyword) {
      const esIds = await es.searchProductsIndex(keyword);
      if (esIds && esIds.length > 0) {
        query._id = { $in: esIds };
      } else {
        // Fallback to Mongoose regex
        query.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ];
      }
    }

    const skipIndex = (page - 1) * limit;
    let productsQuery = Product.find(query).skip(skipIndex).limit(Number(limit));

    // Sorting options
    if (sort === 'priceAsc') {
      productsQuery = productsQuery.sort({ price: 1 });
    } else if (sort === 'priceDesc') {
      productsQuery = productsQuery.sort({ price: -1 });
    } else {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    const products = await productsQuery;
    const total = await Product.countDocuments(query);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Fetch reviews
    const reviews = await Review.find({ productId: product._id }).sort({ createdAt: -1 });
    res.json({ product, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product (Vendor Only)
// @route   POST /api/products
// @access  Private/Vendor
const createProduct = async (req, res) => {
  try {
    const { name, description, price, compareAtPrice, stock, category, gstRate, images } = req.body;

    const product = await Product.create({
      vendorId: req.user.id,
      name,
      description,
      price,
      compareAtPrice,
      stock,
      category,
      gstRate: gstRate || 18,
      images: images || []
    });

    // Synchronize to Elasticsearch index
    await es.indexProduct(product);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product (Vendor Only)
// @route   PUT /api/products/:id
// @access  Private/Vendor
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Verify ownership
    if (product.vendorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price !== undefined ? req.body.price : product.price;
    product.compareAtPrice = req.body.compareAtPrice !== undefined ? req.body.compareAtPrice : product.compareAtPrice;
    product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
    product.category = req.body.category || product.category;
    product.gstRate = req.body.gstRate !== undefined ? req.body.gstRate : product.gstRate;
    product.images = req.body.images || product.images;
    product.isActive = req.body.isActive !== undefined ? req.body.isActive : product.isActive;

    const updated = await product.save();
    
    // Sync update to Elasticsearch
    await es.indexProduct(updated);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product (Vendor Only)
// @route   DELETE /api/products/:id
// @access  Private/Vendor
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.vendorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Product.findByIdAndDelete(product._id);
    
    // Remove from Elasticsearch
    await es.deleteProductIndex(product._id);

    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get products belonging to current vendor
// @route   GET /api/products/vendor/me
// @access  Private/Vendor
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment, userName } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const review = await Review.create({
      productId: product._id,
      userId: req.user.id,
      userName: userName || 'Customer',
      rating: Number(rating),
      comment
    });

    // Recalculate average rating
    const reviews = await Review.find({ productId: product._id });
    product.numOfReviews = reviews.length;
    product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get AI Content-based Recommendations
// @route   GET /api/products/recommendations
// @access  Public
const getAIRecommendations = async (req, res) => {
  try {
    const { productId, limit = 5 } = req.query;

    if (productId) {
      const targetProduct = await Product.findById(productId);
      if (!targetProduct) return res.status(404).json({ message: 'Reference product not found' });

      // Match products in the same category, sorting by rating and stock levels
      const list = await Product.find({
        category: targetProduct.category,
        _id: { $ne: targetProduct._id },
        isActive: true
      })
      .sort({ ratings: -1, stock: -1 })
      .limit(Number(limit));

      return res.json(list);
    }

    // Default recommendation fallback: highly-rated active products
    const featured = await Product.find({ isActive: true })
      .sort({ ratings: -1 })
      .limit(Number(limit));

    res.json(featured);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Internal API: Get stats for Admin Aggregation
// @route   GET /api/products/internal/stats
// @access  Internal
const getInternalStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    res.json({ totalProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  createProductReview,
  getAIRecommendations,
  getInternalStats
};
