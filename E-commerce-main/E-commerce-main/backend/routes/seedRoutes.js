const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/products', async (req, res) => {
  try {
    const vendor = await User.findOne({ role: 'vendor' });
    if (!vendor) {
      return res.status(400).json({ message: 'No vendor found. Please register a vendor first.' });
    }

    const products = [
      // Electronics
      { name: 'Samsung Galaxy S24 Ultra', description: 'Latest flagship with AI camera and S Pen, 12GB RAM, 256GB storage', price: 129999, compareAtPrice: 139999, stock: 45, category: 'electronics', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300', alt: 'Samsung Phone' }] },
      { name: 'iPhone 15 Pro Max', description: 'A17 Pro chip, titanium design, USB-C, 5x optical zoom', price: 159999, compareAtPrice: 169999, stock: 30, category: 'electronics', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300', alt: 'iPhone 15' }] },
      { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise cancellation, 30hr battery', price: 29999, compareAtPrice: 34999, stock: 60, category: 'electronics', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300', alt: 'Sony Headphones' }] },
      { name: 'Dell XPS 15 Laptop', description: 'Intel i9-13900H, 32GB RAM, 1TB SSD, OLED 3.5K', price: 189999, compareAtPrice: 199999, stock: 20, category: 'electronics', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300', alt: 'Dell XPS' }] },
      { name: 'Apple Watch Series 9', description: 'Always-on Retina display, ECG, blood oxygen', price: 45999, compareAtPrice: 49999, stock: 80, category: 'electronics', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300', alt: 'Apple Watch' }] },
      { name: 'Boat Airdopes 141', description: 'Wireless earbuds with 42h battery, ENx tech', price: 1299, compareAtPrice: 2499, stock: 200, category: 'electronics', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300', alt: 'Boat Earbuds' }] },
      { name: 'LG 55-inch OLED TV', description: '4K Smart TV with webOS, 120Hz, G-Sync', price: 119999, compareAtPrice: 139999, stock: 25, category: 'electronics', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300', alt: 'LG TV' }] },
      { name: 'Canon EOS R50 Camera', description: '24.2MP mirrorless, 4K video, kit lens', price: 64999, compareAtPrice: 69999, stock: 15, category: 'electronics', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300', alt: 'Canon Camera' }] },
      { name: 'OnePlus Nord CE 4', description: '5G smartphone, 100W charging, 120Hz AMOLED', price: 24999, compareAtPrice: 27999, stock: 100, category: 'electronics', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300', alt: 'OnePlus' }] },
      { name: 'Logitech MX Master 3S', description: 'Ultra-fast scrolling, 8K DPI, ergonomic', price: 7999, compareAtPrice: 9999, stock: 70, category: 'electronics', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300', alt: 'Logitech Mouse' }] },
      { name: 'HP Victus Gaming Laptop', description: 'RTX 4050, 16GB RAM, 144Hz display', price: 84999, compareAtPrice: 94999, stock: 40, category: 'electronics', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300', alt: 'HP Laptop' }] },
      { name: 'JBL Flip 6 Speaker', description: 'Waterproof, 12h battery, JBL PartyBoost', price: 7999, compareAtPrice: 9999, stock: 90, category: 'electronics', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300', alt: 'JBL Speaker' }] },
      // Clothing
      { name: 'Men Slim Fit Jeans', description: 'Stretchable cotton, available in 28-40 sizes', price: 1499, compareAtPrice: 2999, stock: 150, category: 'clothing', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300', alt: 'Jeans' }] },
      { name: 'Women Cotton Kurti', description: 'Printed A-line kurti, breathable fabric', price: 999, compareAtPrice: 1999, stock: 200, category: 'clothing', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1602810320073-1230c46d89d4?w=300', alt: 'Kurti' }] },
      { name: 'Kids T-Shirt (Pack of 3)', description: '100% cotton, colorful prints, age 2-10 years', price: 799, compareAtPrice: 1499, stock: 300, category: 'clothing', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=300', alt: 'Kids Tee' }] },
      { name: 'Men Casual Shirt', description: 'Linen blend, regular fit, full sleeves', price: 1299, compareAtPrice: 2499, stock: 120, category: 'clothing', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300', alt: 'Casual Shirt' }] },
      { name: 'Women Anarkali Dress', description: 'Festival wear with dupatta, georgette', price: 2499, compareAtPrice: 4999, stock: 80, category: 'clothing', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b46d?w=300', alt: 'Anarkali' }] },
      { name: 'Men Running Shoes', description: 'Lightweight, cushioned sole, non-slip', price: 1999, compareAtPrice: 3999, stock: 100, category: 'clothing', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', alt: 'Running Shoes' }] },
      { name: 'Women Heels', description: 'Comfortable block heels, 3 inch, faux leather', price: 1299, compareAtPrice: 2499, stock: 90, category: 'clothing', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300', alt: 'Heels' }] },
      { name: 'Kids Denim Jacket', description: 'Stylish, durable, adjustable buttons', price: 1799, compareAtPrice: 2999, stock: 60, category: 'clothing', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300', alt: 'Denim Jacket' }] },
      { name: 'Winter Hoodie', description: 'Thick fleece, unisex, kangaroo pocket', price: 1499, compareAtPrice: 2999, stock: 110, category: 'clothing', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300', alt: 'Hoodie' }] },
      { name: 'School Uniform (Boys)', description: 'Shirt + pants set, wrinkle-free', price: 999, compareAtPrice: 1499, stock: 200, category: 'clothing', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1602525965146-9d2ad3c5d1e2?w=300', alt: 'Uniform' }] },
      // Home
      { name: 'Memory Foam Pillow', description: 'Orthopedic, washable cover, cooling gel', price: 999, compareAtPrice: 1999, stock: 180, category: 'home', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=300', alt: 'Pillow' }] },
      { name: 'Non-Stick Cookware Set', description: '10 pieces, induction compatible, PFOA free', price: 2999, compareAtPrice: 5999, stock: 70, category: 'home', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1584990347449-d85d5b4c0fe4?w=300', alt: 'Cookware' }] },
      { name: 'Bamboo Cutting Board', description: 'Eco-friendly, 3 sizes, juice groove', price: 499, compareAtPrice: 999, stock: 150, category: 'home', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1587574293342-f8e6d6c7d5b0?w=300', alt: 'Cutting Board' }] },
      { name: 'LED Floor Lamp', description: 'Dimmable, modern design, E26 socket', price: 2499, compareAtPrice: 3999, stock: 55, category: 'home', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1507473886765-f6b6a4ccf3f1?w=300', alt: 'Lamp' }] },
      { name: 'Cotton Bedsheet Set', description: 'King size, floral print, 2 pillow covers', price: 1299, compareAtPrice: 2499, stock: 120, category: 'home', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300', alt: 'Bedsheet' }] },
      { name: 'Wall Clock (12 inch)', description: 'Silent movement, decorative, battery included', price: 799, compareAtPrice: 1499, stock: 90, category: 'home', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=300', alt: 'Clock' }] },
      { name: 'Vacuum Cleaner', description: 'Handheld, cordless, 15KPa suction', price: 4999, compareAtPrice: 9999, stock: 40, category: 'home', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300', alt: 'Vacuum' }] },
      { name: 'Microfiber Towel Set', description: '4-piece, quick dry, 300 GSM', price: 699, compareAtPrice: 1299, stock: 200, category: 'home', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=300', alt: 'Towels' }] },
      // Beauty
      { name: 'Vitamin C Face Serum', description: 'Brightening, anti-aging, 20ml', price: 599, compareAtPrice: 1499, stock: 250, category: 'beauty', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300', alt: 'Serum' }] },
      { name: 'Matte Lipstick Set', description: '6 shades, long lasting, creamy matte', price: 499, compareAtPrice: 999, stock: 300, category: 'beauty', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300', alt: 'Lipstick' }] },
      { name: 'Face Wash (Charcoal)', description: 'Oil control, deep cleansing, 100ml', price: 249, compareAtPrice: 499, stock: 400, category: 'beauty', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=300', alt: 'Face Wash' }] },
      { name: 'Hair Dryer', description: '1600W, 2 speed, 3 heat settings', price: 1299, compareAtPrice: 2499, stock: 100, category: 'beauty', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=300', alt: 'Hair Dryer' }] },
      { name: 'Nail Polish Remover', description: 'Acetone-free, with vitamin E, 200ml', price: 149, compareAtPrice: 299, stock: 500, category: 'beauty', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300', alt: 'Remover' }] },
      { name: 'Men Beard Oil', description: 'Organic, 30ml, softens beard', price: 399, compareAtPrice: 799, stock: 200, category: 'beauty', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300', alt: 'Beard Oil' }] },
      { name: 'Eye Shadow Palette', description: '18 colors, shimmer + matte, highly pigmented', price: 799, compareAtPrice: 1599, stock: 150, category: 'beauty', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1512496015851-a90fb38f7965?w=300', alt: 'Eyeshadow' }] },
      { name: 'Sunscreen SPF 50', description: 'Water resistant, non-greasy, 100ml', price: 449, compareAtPrice: 899, stock: 300, category: 'beauty', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300', alt: 'Sunscreen' }] },
      // Toys
      { name: 'LEGO Classic Blocks', description: '221 pieces, ages 4+, creative play', price: 1499, compareAtPrice: 2499, stock: 80, category: 'toys', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300', alt: 'LEGO' }] },
      { name: 'Remote Control Car', description: 'Rechargeable, off-road, 2.4GHz', price: 1299, compareAtPrice: 1999, stock: 120, category: 'toys', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300', alt: 'RC Car' }] },
      { name: 'Barbie Dreamhouse', description: 'Doll house with furniture, 3 floors', price: 4999, compareAtPrice: 7999, stock: 30, category: 'toys', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300', alt: 'Barbie' }] },
      { name: 'Puzzle (500 pieces)', description: 'Animal theme, educational', price: 399, compareAtPrice: 799, stock: 200, category: 'toys', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300', alt: 'Puzzle' }] },
      { name: 'Soft Teddy Bear', description: '20 inches, huggable, soft plush', price: 599, compareAtPrice: 1199, stock: 150, category: 'toys', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1570531695443-3ecfb4e8d9c6?w=300', alt: 'Teddy' }] },
      { name: 'Slime Kit', description: '10 colors, scented, non-sticky', price: 299, compareAtPrice: 599, stock: 250, category: 'toys', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1603034202886-2b0c3a3d6c6a?w=300', alt: 'Slime' }] },
      { name: 'Educational Laptop', description: '20 activities, kids 3-7 years', price: 999, compareAtPrice: 1799, stock: 100, category: 'toys', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=300', alt: 'Laptop Toy' }] },
      { name: 'Flying Drone', description: 'Altitude hold, 1080p camera, foldable', price: 2999, compareAtPrice: 4999, stock: 60, category: 'toys', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=300', alt: 'Drone' }] },
      // Books
      { name: 'Atomic Habits', description: 'James Clear - Bestseller, paperback', price: 399, compareAtPrice: 599, stock: 200, category: 'books', gstRate: 5, images: [{ url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300', alt: 'Atomic Habits' }] },
      { name: 'The Alchemist', description: 'Paulo Coelho - Classic, new edition', price: 299, compareAtPrice: 499, stock: 300, category: 'books', gstRate: 5, images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300', alt: 'Alchemist' }] },
      { name: 'Rich Dad Poor Dad', description: 'Robert Kiyosaki - Financial literacy', price: 349, compareAtPrice: 599, stock: 250, category: 'books', gstRate: 5, images: [{ url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300', alt: 'Rich Dad' }] },
      { name: 'Harry Potter Box Set', description: 'All 7 books, hardcover', price: 2999, compareAtPrice: 4999, stock: 50, category: 'books', gstRate: 5, images: [{ url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300', alt: 'Harry Potter' }] },
      { name: 'Thinking, Fast and Slow', description: 'Daniel Kahneman - Nobel Prize winner', price: 499, compareAtPrice: 799, stock: 120, category: 'books', gstRate: 5, images: [{ url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300', alt: 'Thinking Fast' }] },
      { name: 'The Psychology of Money', description: 'Morgan Housel - Timeless lessons', price: 349, compareAtPrice: 599, stock: 180, category: 'books', gstRate: 5, images: [{ url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300', alt: 'Psychology Money' }] },
      { name: 'Children Story Book Set', description: '10 moral stories, colorful illustrations', price: 499, compareAtPrice: 999, stock: 400, category: 'books', gstRate: 5, images: [{ url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300', alt: 'Children Book' }] },
      { name: 'Cracking the Coding Interview', description: 'Gayle Laakmann - Programming guide', price: 799, compareAtPrice: 1299, stock: 80, category: 'books', gstRate: 5, images: [{ url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300', alt: 'Coding Interview' }] },
      // Other
      { name: 'Stainless Steel Water Bottle', description: '750ml, insulated, leak-proof', price: 599, compareAtPrice: 999, stock: 300, category: 'other', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300', alt: 'Bottle' }] },
      { name: 'Backpack (Large)', description: 'Waterproof, laptop compartment, USB port', price: 1499, compareAtPrice: 2499, stock: 150, category: 'other', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300', alt: 'Backpack' }] },
      { name: 'Yoga Mat', description: '6mm thick, non-slip, TPE', price: 799, compareAtPrice: 1499, stock: 200, category: 'other', gstRate: 12, images: [{ url: 'https://images.unsplash.com/photo-1592432678016-d910b3c3cd3e?w=300', alt: 'Yoga Mat' }] },
      { name: 'Smartphone Tripod', description: 'Bluetooth remote, flexible legs', price: 499, compareAtPrice: 999, stock: 250, category: 'other', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1582442105574-c56ef3732c8c?w=300', alt: 'Tripod' }] },
      { name: 'Car Phone Holder', description: 'Dashboard mount, one-touch', price: 299, compareAtPrice: 599, stock: 400, category: 'other', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300', alt: 'Car Holder' }] },
      { name: 'USB-C Fast Charger', description: '65W, GaN technology, 3 ports', price: 1299, compareAtPrice: 2499, stock: 180, category: 'other', gstRate: 18, images: [{ url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300', alt: 'Charger' }] }
    ];

    const productsWithVendor = products.map(p => ({ ...p, vendorId: vendor._id, isActive: true }));
    await Product.deleteMany({});
    const inserted = await Product.insertMany(productsWithVendor);
    res.json({ message: `✅ Seeded ${inserted.length} products successfully!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;