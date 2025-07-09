const express = require('express');
const router = express.Router();
const Order = require('../models/Order')

// POST /api/orders - Place a new order
router.post('/', async (req, res) => {
  try {
    const { items, deliveryDetails, userId } = req.body;

    if (!items || !deliveryDetails || !userId) {
      return res.status(400).json({ message: 'User ID, items, and delivery details are required' });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Order({
      userId: String(userId),
      items,
      deliveryDetails,
      total,
      status: 'Pending',
    });

    await newOrder.save();
    console.log('Order saved for user:', userId);

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/user/:userId - Get orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/all - Admin: Get all orders
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PUT /api/orders/:id/status - Admin: Update order status
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
