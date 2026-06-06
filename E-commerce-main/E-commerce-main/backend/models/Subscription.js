const mongoose = require('mongoose');
const planSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plan: { type: String, enum: ['basic', 'premium', 'enterprise'], default: 'basic' },
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: true },
});
module.exports = mongoose.model('Subscription', planSchema);