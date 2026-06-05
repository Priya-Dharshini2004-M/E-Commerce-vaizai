const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    console.log('1. Auth middleware started');
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        console.log('2. User found:', req.user.email);
        next();
      } catch (error) {
        console.log('3. Auth error:', error);
        return res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      console.log('4. No token');
      return res.status(401).json({ message: 'No token' });
    }
  };

module.exports = { protect };