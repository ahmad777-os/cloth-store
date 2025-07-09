// routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// Send message
router.post('/', async (req, res) => {
  const { sender, receiver, text, orderId } = req.body;
  const message = new Message({ sender, receiver, text, orderId });
  await message.save();
  res.status(201).json({ message: 'Message sent' });
});

// Get chat messages between admin and a user
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: 'admin' },
      { sender: 'admin', receiver: userId },
    ],
  }).sort({ timestamp: 1 });
  res.json(messages);
});

module.exports = router;
