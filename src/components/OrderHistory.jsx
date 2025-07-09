import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        const userData = JSON.parse(storedUser);
        const userId = userData.userId;

        if (!userId) {
          setError('User ID not found');
          setLoading(false);
          return;
        }

        console.log('User ID from localStorage:', userId); // For debugging

        const response = await axios.get(
          `http://localhost:5000/api/orders/user/${userId}`
        );

        console.log('Orders fetched:', response.data); // For debugging
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading order history...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {orders.map((order) => {
            const total = order.items?.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ) || 0;

            return (
              <li
                key={order._id}
                style={{
                  marginBottom: '20px',
                  borderBottom: '1px solid #ccc',
                  paddingBottom: '10px',
                }}
              >
                <strong>Order #{order._id.slice(-6)}</strong>
                <br />
                Total: ${total.toFixed(2)}
                <br />
                Status: {order.status || 'Pending'}
                <br />
                <small>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : 'Date not available'}
                </small>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
