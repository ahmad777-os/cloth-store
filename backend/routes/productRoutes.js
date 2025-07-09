const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/products');
const { adminAuth } = require('../middleware/auth');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {  
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({ storage, fileFilter });

// ✅ GET all products or by category
router.get('/', async (req, res) => {
  try {
    const category = req.query.category?.toLowerCase();
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ POST - Add new product with images
router.post('/', adminAuth, upload.array('images', 3), async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.body;
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const newProduct = new Product({
      name,
      description,
      price,
      category: category.toLowerCase(),
      quantity,
      images: imagePaths,
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// ✅ DELETE product and its images
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete associated images
    if (product.images && product.images.length > 0) {
      product.images.forEach((imgPath) => {
        const fullPath = path.join(__dirname, '..', imgPath);
        fs.unlink(fullPath, (err) => {
          if (err) console.error('Failed to delete image file:', err);
        });
      });
    }

    await Product.findByIdAndDelete(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
