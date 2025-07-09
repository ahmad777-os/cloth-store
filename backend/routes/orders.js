const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // adjust path if necessary

// @desc    Get all orders for a specific user
// @route   GET /api/orders/user/:userId
// @access  Public or Protected (adjust based on your app's needs)
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    console.log('🔍 Fetching orders for userId:', userId); // Logging incoming userId

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    console.log('✅ Orders found:', orders.length);
    res.status(200).json(orders);
  } catch (err) {
    console.error('❌ Error fetching user orders:', err);
    res.status(500).json({
      message: 'Error fetching orders',
      error: err.message,
    });
  }
});

module.exports = router;
