import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Navbar.css';
import '../css/font.css';
const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const userId = JSON.parse(localStorage.getItem('user'))?.userId;

  const toggleNotifications = async () => {
    setOpen(!open);
    if (!open && userId) {
      try {
        const res = await axios.get(`http://localhost:5000/api/notifications/user/${userId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    }
  };

  return (
    <div className="notification-container">
      <button className="notification-bell" onClick={toggleNotifications} title="Notifications">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon-bell"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.6}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 00-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
    />
  </svg>
</button>

      {open && (
        <div className="notification-dropdown">
          <h4>Notifications</h4>
          <ul>
            {notifications.length === 0 ? (
              <li>No notifications</li>
            ) : (
              notifications.map((n, i) => <li key={i}>{n.message}</li>)
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
    window.addEventListener('userUpdated', fetchUser);
    return () => window.removeEventListener('userUpdated', fetchUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">احمد</Link>
      </div>

      <div className="navbar-right">
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <div className="navbar-links">
            <Link to="/">Home</Link>

            {user?.role === 'user' && (
              <Link to="/cart" title="Cart" className="icon-link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M6 6h15l-1.5 9h-13L4 4H2"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="9" cy="20" r="1.5" />
                  <circle cx="18" cy="20" r="1.5" />
                </svg>
              </Link>
            )}

            {user?.role === 'admin' && (
              <>
                <Link to="/add-product">Add Product</Link>
                <Link to="/products">Product List</Link>
                <Link to="/admin/orders">All Orders</Link>
              </>
            )}
          </div>


          <div className="navbar-actions">
            {!user ? (
              <>
                <Link to="/login" className="navbar-button">Login</Link>
                <Link to="/signup" className="navbar-button">Signup</Link>
              </>
            ) : (
              <>
                <span className="navbar-welcome">Welcome, {user.fullName}</span>
                {user.role === 'user' && (
                  <>
                    <NotificationBell />
                    <Link to="/orders" className="order-history-button">Order History</Link>
                  </>
                )}
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
