import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(`http://localhost:5000/api/products/${id}`);
        const allRes = await axios.get('http://localhost:5000/api/products');
        setProduct(productRes.data);
        setAllProducts(allRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const getRandomProducts = () => {
    const others = allProducts.filter((p) => p._id !== product._id);
    return others.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size.');
      return;
    }

    if (quantity < 1 || quantity > product.quantity) {
      alert(`Please select a valid quantity (1-${product.quantity})`);
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      selectedSize,
      quantity,
    };

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...existingCart, cartItem];
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    alert('Item added to cart!');
  };

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found.</p>;

  const randomProducts = getRandomProducts();

  return (
    <div className="product-detail-wrapper">
      <div className="product-detail-container">
        <div className="slider">
          <button onClick={handlePrev} className="nav-btn">◀</button>
          <img
            src={`http://localhost:5000${product.images[currentImageIndex]}`}
            alt={`Product ${currentImageIndex + 1}`}
            className="product-image"
          />
          <button onClick={handleNext} className="nav-btn">▶</button>
        </div>

        <div className="details">
          <h2 className="title">{product.name}</h2>
          <p className="description">{product.description}</p>
          <p className="price">${product.price}</p>
          <p><strong>Category:</strong> {product.category}</p>

          {product.sizes?.length > 0 && (
            <div className="size-select">
              <label><strong>Select Size:</strong></label><br />
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">-- Choose a size --</option>
                {product.sizes.map((size, index) => (
                  <option key={index} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}

          <div className="quantity-select">
            <label><strong>Quantity:</strong></label><br />
            <input
              type="number"
              min="1"
              max={product.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <p><strong>Only {product.quantity} left in stock</strong></p>

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>

      <hr className="divider" />

      <h3>Recommended Products</h3>
      <div className="suggestions">
        {randomProducts.map((item) => (
          <div key={item._id} className="suggestion-card">
            <img
              src={`http://localhost:5000${item.images?.[0]}`}
              alt={item.name}
            />
            <h4>{item.name}</h4>
            <p>${item.price}</p>
            <Link to={`/product/${item._id}`}>View</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
