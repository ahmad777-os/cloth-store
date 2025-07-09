const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  deliveryDetails: {
    fullName: String,
    phoneNumber: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
  },
  total: Number,
  status: {
    type: String,
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema); // ✅ MUST use model() here
