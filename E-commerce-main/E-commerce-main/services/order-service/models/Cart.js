const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        image: { type: String },
        vendorId: { type: mongoose.Schema.Types.ObjectId }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
