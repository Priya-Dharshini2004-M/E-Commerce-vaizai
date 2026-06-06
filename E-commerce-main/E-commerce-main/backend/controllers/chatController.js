const Chat = require('../models/Chat');

const getMessages = async (req, res) => {
  try {
    const messages = await Chat.find({
      $or: [
        { senderId: req.user.id, receiverId: null },
        { receiverId: req.user.id },
      ],
    }).sort('createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const chat = await Chat.create({
      senderId: req.user.id,
      senderName: req.user.name,
      receiverId: null,
      message,
      isSupportReply: false,
    });
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only – reply to a user
const replyMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;
    const reply = await Chat.create({
      senderId: req.user.id,
      senderName: 'Support',
      receiverId: userId,
      message,
      isSupportReply: true,
    });
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, sendMessage, replyMessage };