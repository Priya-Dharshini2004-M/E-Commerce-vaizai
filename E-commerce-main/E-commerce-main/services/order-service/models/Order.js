const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        vendorId: { type: mongoose.Schema.Types.ObjectId, required: true },
        gstAmount: { type: Number, default: 0 }
      }
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentMethod: { type: String, required: true }, // 'Razorpay' or 'Stripe'
    paymentResult: {
      id: String,
      status: String,
      signature: String
    },
    taxAmount: { type: Number, default: 0 },
    shippingAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing'
    },
    isFraud: { type: Boolean, default: false },
    fraudScore: { type: Number, default: 0 },
    fraudReason: String,
    couponApplied: String,
    discountAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
