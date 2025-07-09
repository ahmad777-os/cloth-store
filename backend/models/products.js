const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  images: { type: [String], default: [] },

  // ✅ Add sizes array
  sizes: { type: [String], default: ['S', 'M', 'L', 'XL'] }

}, {
  collection: 'AddproductCollection',
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
