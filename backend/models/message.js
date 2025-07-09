// models/message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: String, // "admin" or userId
  receiver: String, // userId or "admin"
  text: String,
  timestamp: { type: Date, default: Date.now },
  orderId: String // optional: link to specific order
});

module.exports = mongoose.model('Message', messageSchema);
