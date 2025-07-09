import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/font.css';
import '../css/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchCategory, setSearchCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        alert('Product deleted!');
        fetchProducts();
      } catch (error) {
        alert('Failed to delete product');
        console.error(error);
      }
    }
  };

  // Normalize string for better matching
  const normalize = (str) => str.toLowerCase().replace(/\s+/g, ' ').trim();

  const filteredProducts = products.filter((product) =>
    normalize(product.category).includes(normalize(searchCategory))
  );

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Product List</h2>

      {/* Search Bar */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search by category..."
        value={searchCategory}
        onChange={(e) => setSearchCategory(e.target.value)}
      />

      {filteredProducts.length === 0 ? (
        <p className="no-products-text">No products found</p>
      ) : (
        filteredProducts.map((product) => (
          <div key={product._id} className="product-card">
            <h3 className="product-name">{product.name}</h3>

            {product.images?.length > 0 && (
              <img
                src={`http://localhost:5000${product.images[0]}`}
                alt={product.name}
                className="product-image"
              />
            )}

            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Price:</strong> Rs. {product.price}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Quantity:</strong> {product.quantity}</p>

            <button
              onClick={() => deleteProduct(product._id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
