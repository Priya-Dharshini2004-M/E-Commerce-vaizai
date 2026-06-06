const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null = support team
  message: { type: String, required: true },
  isSupportReply: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);