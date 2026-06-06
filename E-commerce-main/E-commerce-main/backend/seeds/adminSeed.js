const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected'))
  .catch(err => console.log(err));

const createAdmin = async () => {
  try {
    const existing = await User.findOne({ email: 'admin@multivendor.com' });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);
    const admin = new User({
      name: 'Super Admin',
      email: 'admin@multivendor.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });
    await admin.save();
    console.log('Admin created: admin@multivendor.com / Admin@123');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();