const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

const fixAdmin = async () => {
  try {
    // Delete existing admin (optional)
    await User.deleteOne({ email: 'admin@multivendor.com' });
    
    // Create new admin with a simple password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Super Admin',
      email: 'admin@multivendor.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });
    await admin.save();
    console.log('✅ Admin created with:');
    console.log('   Email: admin@multivendor.com');
    console.log('   Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixAdmin();