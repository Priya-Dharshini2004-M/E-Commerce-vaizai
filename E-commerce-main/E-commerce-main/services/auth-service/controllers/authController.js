const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

// @desc    Register a new user / vendor
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, storeName, gstNumber, storeDescription } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const isVendor = role === 'vendor';
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      vendorInfo: isVendor ? {
        storeName,
        gstNumber,
        storeDescription,
        isApproved: false,
        subscriptionPlan: 'basic'
      } : undefined
    });

    if (user) {
      const token = generateToken(user._id, user.role);
      const refreshToken = generateRefreshToken(user._id);

      // Set cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        vendorInfo: user.vendorInfo
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        return res.status(401).json({ message: 'Account disabled. Contact admin.' });
      }

      const token = generateToken(user._id, user.role);
      const refreshToken = generateRefreshToken(user._id);

      // Set HttpOnly Cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
        vendorInfo: user.vendorInfo
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshAccessToken = async (req, res) => {
  try {
    const tokenFromCookie = req.cookies ? req.cookies.refreshToken : null;
    const tokenFromBody = req.body.refreshToken;
    const token = tokenFromCookie || tokenFromBody;

    if (!token) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid or suspended user' });
    }

    const accessToken = generateToken(user._id, user.role);
    res.json({ token: accessToken });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token signature' });
  }
};

// @desc    Logout user & clear refresh token cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.avatar = req.body.avatar || user.avatar;

    if (user.role === 'vendor' && req.body.vendorInfo) {
      user.vendorInfo.storeName = req.body.vendorInfo.storeName || user.vendorInfo.storeName;
      user.vendorInfo.storeDescription = req.body.vendorInfo.storeDescription || user.vendorInfo.storeDescription;
      user.vendorInfo.gstNumber = req.body.vendorInfo.gstNumber || user.vendorInfo.gstNumber;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      vendorInfo: updatedUser.vendorInfo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getMe,
  updateProfile
};
