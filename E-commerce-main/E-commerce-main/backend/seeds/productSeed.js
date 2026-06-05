const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error(err));

// List of vendor IDs – replace with actual vendor IDs from your database
// First, create a vendor user manually or use the first vendor you registered
// For demo, we'll use a placeholder – you need to replace with real vendor IDs
const vendorIds = [
  '6a2059d887151fe49d9970d4', // Replace with actual vendor ID from your DB
];

// Helper to get random vendor ID from the list
const getRandomVendor = () => vendorIds[Math.floor(Math.random() * vendorIds.length)];

// Define categories (matches frontend filter)
const categories = [
  'electronics', 'clothing', 'home', 'beauty', 'toys', 'books', 'other'
];

// Product images (placeholders – replace with actual URLs if needed)
const imagePlaceholders = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300',
  clothing: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300',
  home: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc6efae2?w=300',
  toys: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300',
  books: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300',
  other: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
};

// Generate 60 products
const products = [
  // Electronics (12 products)
  { name: 'Samsung Galaxy S24 Ultra', description: 'Latest flagship with AI camera and S Pen', price: 129999, compareAtPrice: 139999, stock: 45, category: 'electronics', gstRate: 18 },
  { name: 'iPhone 15 Pro Max', description: 'A17 Pro chip, titanium design, USB-C', price: 159999, compareAtPrice: 169999, stock: 30, category: 'electronics', gstRate: 18 },
  { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise cancellation', price: 29999, compareAtPrice: 34999, stock: 60, category: 'electronics', gstRate: 18 },
  { name: 'Dell XPS 15 Laptop', description: 'Intel i9, 32GB RAM, 1TB SSD, OLED', price: 189999, compareAtPrice: 199999, stock: 20, category: 'electronics', gstRate: 18 },
  { name: 'Apple Watch Series 9', description: 'Always-on Retina display, health tracking', price: 45999, compareAtPrice: 49999, stock: 80, category: 'electronics', gstRate: 18 },
  { name: 'Boat Airdopes 141', description: 'Wireless earbuds with 42h battery', price: 1299, compareAtPrice: 2499, stock: 200, category: 'electronics', gstRate: 18 },
  { name: 'LG 55-inch OLED TV', description: '4K Smart TV with webOS', price: 119999, compareAtPrice: 139999, stock: 25, category: 'electronics', gstRate: 18 },
  { name: 'Canon EOS R50 Camera', description: 'Mirrorless camera with 24.2MP', price: 64999, compareAtPrice: 69999, stock: 15, category: 'electronics', gstRate: 18 },
  { name: 'OnePlus Nord CE 4', description: '5G smartphone, 100W charging', price: 24999, compareAtPrice: 27999, stock: 100, category: 'electronics', gstRate: 18 },
  { name: 'Logitech MX Master 3S Mouse', description: 'Ultra-fast scrolling, ergonomic', price: 7999, compareAtPrice: 9999, stock: 70, category: 'electronics', gstRate: 18 },
  { name: 'HP Victus Gaming Laptop', description: 'RTX 4050, 16GB RAM, 144Hz', price: 84999, compareAtPrice: 94999, stock: 40, category: 'electronics', gstRate: 18 },
  { name: 'JBL Flip 6 Speaker', description: 'Waterproof, 12h battery', price: 7999, compareAtPrice: 9999, stock: 90, category: 'electronics', gstRate: 18 },

  // Clothing (10 products)
  { name: 'Men Slim Fit Jeans', description: 'Stretchable cotton, all sizes', price: 1499, compareAtPrice: 2999, stock: 150, category: 'clothing', gstRate: 12 },
  { name: 'Women Cotton Kurti', description: 'Printed, breathable fabric', price: 999, compareAtPrice: 1999, stock: 200, category: 'clothing', gstRate: 12 },
  { name: 'Kids T-Shirt (Pack of 3)', description: '100% cotton, colorful prints', price: 799, compareAtPrice: 1499, stock: 300, category: 'clothing', gstRate: 12 },
  { name: 'Men Casual Shirt', description: 'Linen blend, regular fit', price: 1299, compareAtPrice: 2499, stock: 120, category: 'clothing', gstRate: 12 },
  { name: 'Women Anarkali Dress', description: 'Festival wear with dupatta', price: 2499, compareAtPrice: 4999, stock: 80, category: 'clothing', gstRate: 12 },
  { name: 'Men Running Shoes', description: 'Lightweight, cushioned sole', price: 1999, compareAtPrice: 3999, stock: 100, category: 'clothing', gstRate: 12 },
  { name: 'Women Heels', description: 'Comfortable block heels', price: 1299, compareAtPrice: 2499, stock: 90, category: 'clothing', gstRate: 12 },
  { name: 'Kids Denim Jacket', description: 'Stylish, durable', price: 1799, compareAtPrice: 2999, stock: 60, category: 'clothing', gstRate: 12 },
  { name: 'Winter Hoodie', description: 'Thick fleece, unisex', price: 1499, compareAtPrice: 2999, stock: 110, category: 'clothing', gstRate: 12 },
  { name: 'School Uniform (Boys)', description: 'Shirt + pants set', price: 999, compareAtPrice: 1499, stock: 200, category: 'clothing', gstRate: 12 },

  // Home (8 products)
  { name: 'Memory Foam Pillow', description: 'Orthopedic, washable cover', price: 999, compareAtPrice: 1999, stock: 180, category: 'home', gstRate: 18 },
  { name: 'Non-Stick Cookware Set', description: '10 pieces, induction compatible', price: 2999, compareAtPrice: 5999, stock: 70, category: 'home', gstRate: 18 },
  { name: 'Bamboo Cutting Board', description: 'Eco-friendly, 3 sizes', price: 499, compareAtPrice: 999, stock: 150, category: 'home', gstRate: 18 },
  { name: 'LED Floor Lamp', description: 'Dimmable, modern design', price: 2499, compareAtPrice: 3999, stock: 55, category: 'home', gstRate: 18 },
  { name: 'Cotton Bedsheet Set', description: 'King size, floral print', price: 1299, compareAtPrice: 2499, stock: 120, category: 'home', gstRate: 12 },
  { name: 'Wall Clock (12 inch)', description: 'Silent movement, decorative', price: 799, compareAtPrice: 1499, stock: 90, category: 'home', gstRate: 18 },
  { name: 'Vacuum Cleaner', description: 'Handheld, cordless', price: 4999, compareAtPrice: 9999, stock: 40, category: 'home', gstRate: 18 },
  { name: 'Microfiber Towel Set', description: '4-piece, quick dry', price: 699, compareAtPrice: 1299, stock: 200, category: 'home', gstRate: 12 },

  // Beauty (8 products)
  { name: 'Vitamin C Face Serum', description: 'Brightening, anti-aging', price: 599, compareAtPrice: 1499, stock: 250, category: 'beauty', gstRate: 18 },
  { name: 'Matte Lipstick Set', description: '6 shades, long lasting', price: 499, compareAtPrice: 999, stock: 300, category: 'beauty', gstRate: 18 },
  { name: 'Face Wash (Charcoal)', description: 'Oil control, 100ml', price: 249, compareAtPrice: 499, stock: 400, category: 'beauty', gstRate: 18 },
  { name: 'Hair Dryer', description: '1600W, 2 speed settings', price: 1299, compareAtPrice: 2499, stock: 100, category: 'beauty', gstRate: 18 },
  { name: 'Nail Polish Remover', description: 'Acetone-free, 200ml', price: 149, compareAtPrice: 299, stock: 500, category: 'beauty', gstRate: 18 },
  { name: 'Men Beard Oil', description: 'Organic, 30ml', price: 399, compareAtPrice: 799, stock: 200, category: 'beauty', gstRate: 18 },
  { name: 'Eye Shadow Palette', description: '18 colors, shimmer + matte', price: 799, compareAtPrice: 1599, stock: 150, category: 'beauty', gstRate: 18 },
  { name: 'Sunscreen SPF 50', description: 'Water resistant, 100ml', price: 449, compareAtPrice: 899, stock: 300, category: 'beauty', gstRate: 18 },

  // Toys (8 products)
  { name: 'LEGO Classic Blocks', description: '221 pieces, ages 4+', price: 1499, compareAtPrice: 2499, stock: 80, category: 'toys', gstRate: 12 },
  { name: 'Remote Control Car', description: 'Rechargeable, off-road', price: 1299, compareAtPrice: 1999, stock: 120, category: 'toys', gstRate: 12 },
  { name: 'Barbie Dreamhouse', description: 'Doll house with furniture', price: 4999, compareAtPrice: 7999, stock: 30, category: 'toys', gstRate: 12 },
  { name: 'Puzzle (500 pieces)', description: 'Animal theme', price: 399, compareAtPrice: 799, stock: 200, category: 'toys', gstRate: 12 },
  { name: 'Soft Teddy Bear', description: '20 inches, huggable', price: 599, compareAtPrice: 1199, stock: 150, category: 'toys', gstRate: 12 },
  { name: 'Slime Kit', description: '10 colors, scented', price: 299, compareAtPrice: 599, stock: 250, category: 'toys', gstRate: 12 },
  { name: 'Educational Laptop', description: '20 activities, kids', price: 999, compareAtPrice: 1799, stock: 100, category: 'toys', gstRate: 12 },
  { name: 'Flying Drone', description: 'Altitude hold, 1080p camera', price: 2999, compareAtPrice: 4999, stock: 60, category: 'toys', gstRate: 12 },

  // Books (8 products)
  { name: 'Atomic Habits (James Clear)', description: 'Bestseller, paperback', price: 399, compareAtPrice: 599, stock: 200, category: 'books', gstRate: 5 },
  { name: 'The Alchemist (Paulo Coelho)', description: 'Classic, new edition', price: 299, compareAtPrice: 499, stock: 300, category: 'books', gstRate: 5 },
  { name: 'Rich Dad Poor Dad', description: 'Financial literacy', price: 349, compareAtPrice: 599, stock: 250, category: 'books', gstRate: 5 },
  { name: 'Harry Potter Box Set', description: 'All 7 books, hardcover', price: 2999, compareAtPrice: 4999, stock: 50, category: 'books', gstRate: 5 },
  { name: 'Thinking, Fast and Slow', description: 'Nobel Prize winner', price: 499, compareAtPrice: 799, stock: 120, category: 'books', gstRate: 5 },
  { name: 'The Psychology of Money', description: 'Timeless lessons', price: 349, compareAtPrice: 599, stock: 180, category: 'books', gstRate: 5 },
  { name: 'Children Story Book Set', description: '10 moral stories', price: 499, compareAtPrice: 999, stock: 400, category: 'books', gstRate: 5 },
  { name: 'Cracking the Coding Interview', description: 'Programming guide', price: 799, compareAtPrice: 1299, stock: 80, category: 'books', gstRate: 5 },

  // Other (6 products)
  { name: 'Stainless Steel Water Bottle', description: '750ml, insulated', price: 599, compareAtPrice: 999, stock: 300, category: 'other', gstRate: 18 },
  { name: 'Backpack (Large)', description: 'Waterproof, laptop compartment', price: 1499, compareAtPrice: 2499, stock: 150, category: 'other', gstRate: 12 },
  { name: 'Yoga Mat', description: '6mm thick, non-slip', price: 799, compareAtPrice: 1499, stock: 200, category: 'other', gstRate: 12 },
  { name: 'Smartphone Tripod', description: 'Bluetooth remote, flexible legs', price: 499, compareAtPrice: 999, stock: 250, category: 'other', gstRate: 18 },
  { name: 'Car Phone Holder', description: 'Dashboard mount', price: 299, compareAtPrice: 599, stock: 400, category: 'other', gstRate: 18 },
  { name: 'USB-C Fast Charger', description: '65W, GaN technology', price: 1299, compareAtPrice: 2499, stock: 180, category: 'other', gstRate: 18 },
];

// Map products to full objects with vendorId and image
const fullProducts = products.map(product => ({
  ...product,
  vendorId: getRandomVendor(),
  images: [{ url: imagePlaceholders[product.category], alt: product.name }],
  isActive: true,
}));

// Seed function
const seedProducts = async () => {
  try {
    await Product.deleteMany(); // Optional: clears existing products
    const inserted = await Product.insertMany(fullProducts);
    console.log(`✅ Successfully inserted ${inserted.length} products`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedProducts();