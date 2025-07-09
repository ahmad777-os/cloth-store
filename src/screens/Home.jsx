import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Aboutus from './Aboutus';
import '../css/Home.css';
import '../css/font.css';

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [categories] = useState([
    'check shirts',
    'crinkle shirts',
    'hawaiian shirts',
    'polo t-shirts',
    'trousers'
  ]);
  const [categoryData, setCategoryData] = useState({});
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setAllProducts(res.data))
      .catch(err => console.error(err));

    const fetchCategoryData = async () => {
      for (const cat of categories) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/products?category=${encodeURIComponent(cat)}`
          );
          setCategoryData(prev => ({
            ...prev,
            [cat]: res.data,
          }));
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchCategoryData();
  }, [categories]);

  useEffect(() => {
    if (user?.userId) {
      axios.get(`http://localhost:5000/api/orders/user/${user.userId}`)
        .then(res => setOrders(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  // Enhanced scroll animation with slide-up effect
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.scroll-reveal');
      const windowHeight = window.innerHeight;
      const elementVisible = 150; // How many pixels an element needs to be visible

      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const isVisible = elementPosition < windowHeight - elementVisible;

        if (isVisible) {
          element.classList.add('active');
        } else {
          // Optional: Remove class if you want animation to trigger again
          // element.classList.remove('active');
        }
      });
    };

    // Initial check
    animateOnScroll();

    // Add event listener
    window.addEventListener('scroll', animateOnScroll);

    // Clean up
    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  return (
    <div className="home-container">
      <h1 className="scroll-reveal">My Store</h1>

      <h2 className="scroll-reveal">All Products</h2>
      <div className="products-wrapper">
        {allProducts.map((product, index) => (
          <div 
            key={product._id} 
            className="product-card scroll-reveal"
            style={{ transitionDelay: `${index * 0.1}s` }} // Staggered animation
          >
            <img
              src={`http://localhost:5000${product.images?.[0]}`}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <Link to={`/product/${product._id}`}>View</Link>
          </div>
        ))}
      </div>

      {categories.map((cat, catIndex) => (
        <div key={cat} className="category-section">
          <h2 className="scroll-reveal" style={{ transitionDelay: `${catIndex * 0.05}s` }}>
            {cat.toUpperCase()}
          </h2>
          <div className="products-wrapper">
            {categoryData[cat]?.length > 0 ? (
              categoryData[cat].map((product, index) => (
                <div 
                  key={product._id} 
                  className="product-card scroll-reveal"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={`http://localhost:5000${product.images?.[0]}`}
                    alt={product.name}
                    className="product-image"
                  />
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                  <Link to={`/product/${product._id}`}>View</Link>
                </div>
              ))
            ) : (
              <p className="scroll-reveal">No products in this category yet.</p>
            )}
          </div>
        </div>
      ))}

      <div className="about-section scroll-reveal">
        <Aboutus />
      </div>
    </div>
  );
};

export default Home;