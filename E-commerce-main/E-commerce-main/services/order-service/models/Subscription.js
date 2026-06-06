const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    planName: { type: String, enum: ['basic', 'premium', 'enterprise'], required: true },
    amount: { type: Number, required: true },
    paymentId: { type: String },
    status: { type: String, enum: ['active', 'expired', 'pending'], default: 'pending' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
