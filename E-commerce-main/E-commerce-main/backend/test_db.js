const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Cart = require('./models/Cart');

dotenv.config();

async function checkCart() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    const carts = await Cart.find({});
    console.log('Carts found:', carts.length);
    for (const cart of carts) {
      console.log(`User: ${cart.userId}`);
      for (const item of cart.items) {
        console.log(`- Item name: ${item.name}`);
        console.log(`  productId: ${item.productId} (type: ${typeof item.productId})`);
        if (item.productId) {
          console.log(`  productId.constructor.name: ${item.productId.constructor.name}`);
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkCart();
