const Product = require('../models/Product');

//create product 
const createProduct = async (req, res) => {
    console.log('5. Inside createProduct');
    try {
      console.log('6. req.user:', req.user.id);
      const { name, description, price, stock, category } = req.body;
      console.log('7. Body:', { name, price });
      const product = new Product({
        vendorId: req.user.id,
        name,
        description,
        price,
        stock,
        category,
      });
      console.log('8. About to save');
      const saved = await product.save();
      console.log('9. Saved successfully');
      res.status(201).json(saved);
    } catch (error) {
      console.log('10. Error in createProduct:', error);
      res.status(500).json({ message: error.message });
    }
  };

// GET all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('vendorId', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendorId', 'name');
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    if (product.vendorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    if (product.vendorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await product.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET vendor's own products
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
};