import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../css/font.css';
import '../css/AddProducts.css';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
  });

  const [imageFiles, setImageFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', Number(formData.price));
    data.append('category', formData.category);
    data.append('quantity', formData.quantity);

    imageFiles.forEach((file) => data.append('images', file));

    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

      await axios.post(`${API_BASE_URL}/api/products`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      alert('Product added!');

      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        quantity: '',
      });
      setImageFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      alert('Failed to add product');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      <h2>Add New Product</h2>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product Name"
        required
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />

      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />

      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
        required
      />

      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        required
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        required
      />

      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;
