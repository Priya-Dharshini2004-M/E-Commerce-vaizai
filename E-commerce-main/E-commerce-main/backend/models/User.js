const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    vendorInfo: {
      storeName: String,
      gstNumber: String,
      storeDescription: String,
      isApproved: { type: Boolean, default: false },
      subscriptionPlan: { type: String, enum: ['basic', 'premium', 'enterprise'], default: 'basic' },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);