const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Cart = require('./models/Cart');

dotenv.config();

async function simulateUpdate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const userId = '6a22d15dc1a5ac181767b2d8';
    const productId = '6a22da4716be278ec6ab117a';
    const quantity = 2;

    const cart = await Cart.findOne({ userId });
    console.log('Cart retrieved:', cart ? 'yes' : 'no');
    if (cart) {
      console.log('Cart items before:', cart.items.length);
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      console.log('Item index found:', itemIndex);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        console.log('Updating quantity to:', quantity);
        await cart.save();
        console.log('Saved successfully. New total price:', cart.totalPrice);
      }
    }
  } catch (error) {
    console.error('Error during update simulation:', error);
  } finally {
    await mongoose.disconnect();
  }
}

simulateUpdate();
