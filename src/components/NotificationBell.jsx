import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem('user'))?.userId;

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/notifications/user/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const handleClick = () => {
    setOpen(!open);
    if (!open) {
      fetchNotifications();
    }
  };

  const handlePayNow = (orderId) => {
    navigate(`/payment/${orderId}`);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={handleClick} style={{ fontSize: '18px' }}>
        🔔
        {notifications.length > 0 && <span style={{ color: 'red', fontWeight: 'bold' }}>•</span>}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: 0,
            background: '#fff',
            border: '1px solid #ccc',
            padding: '10px',
            width: '300px',
            zIndex: 1000,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h4>Notifications</h4>
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {notifications.map((n, idx) => (
                <li key={idx} style={{ marginBottom: '10px' }}>
                  <div>{n.message}</div>
                  {n.message.includes('proceed to payment') && (
                    <button
                      onClick={() => handlePayNow(n.orderId)}
                      style={{
                        marginTop: '5px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Pay Now
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
