const express = require('express');
const { getMessages, sendMessage, replyMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, getMessages);
router.post('/', protect, sendMessage);
router.post('/reply', protect, authorize('admin'), replyMessage);

module.exports = router;