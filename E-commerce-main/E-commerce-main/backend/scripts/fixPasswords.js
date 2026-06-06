const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected');
    const users = await User.find({});
    for (let user of users) {
      // If password does not start with $2 (bcrypt hash) then re‑hash it
      if (!user.password.startsWith('$2')) {
        const hashed = await bcrypt.hash(user.password, 10);
        user.password = hashed;
        await user.save();
        console.log(`Fixed password for ${user.email}`);
      }
    }
    console.log('Done');
    process.exit(0);
  })
  .catch(err => console.log(err));