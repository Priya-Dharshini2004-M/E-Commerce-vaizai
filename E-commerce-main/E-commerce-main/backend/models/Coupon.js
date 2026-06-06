const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    minOrderValue: Number,
    maxDiscount: Number,
    validFrom: Date,
    validUntil: Date,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
  });
  module.exports = mongoose.model('Coupon', couponSchema);