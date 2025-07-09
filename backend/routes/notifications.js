const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification'); // make sure this path is correct

// POST /api/notifications
router.post('/', async (req, res) => {
  try {
    const { userId, orderId, message } = req.body;

    const notification = new Notification({
      userId,
      orderId,
      message,
      createdAt: new Date()
    });

    await notification.save();
    res.json(notification);
  } catch (error) {
    console.error('Error saving notification:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
});

module.exports = router;
