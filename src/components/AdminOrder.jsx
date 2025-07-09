import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/font.css';
import '../css/AdminOrders.css'; // Add this import

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/all');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, userId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });

      const message =
        newStatus === 'In Process'
          ? 'Your order is now being processed. Please proceed to payment.'
          : 'Your order was rejected by the admin.';

      await axios.post('http://localhost:5000/api/notifications', {
        userId,
        orderId,
        message,
      });

      fetchAllOrders();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="admin-orders-container">
      <h2 className="admin-orders-title">Admin Panel - All Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders-text">No orders found.</p>
      ) : (
        orders.map((order, idx) => (
          <div key={idx} className="order-card">
            <p><strong>User ID:</strong> {order.userId}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ${order.total}</p>
            <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>

            <h4>Items:</h4>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} - {item.size} - {item.quantity} x ${item.price}
                </li>
              ))}
            </ul>

            <h4>Delivery Details:</h4>
            <p>{order.deliveryDetails.fullName}</p>
            <p>{order.deliveryDetails.address}, {order.deliveryDetails.city}</p>
            <p>{order.deliveryDetails.country} - {order.deliveryDetails.postalCode}</p>
            <p>Phone: {order.deliveryDetails.phoneNumber}</p>

            {/* Status Actions */}
            {order.status === 'Pending' && (
              <div className="btn-group">
                <button
                  className="btn-accept"
                  onClick={() => updateOrderStatus(order._id, 'In Process', order.userId)}
                >
                  ✅ Accept
                </button>
                <button
                  className="btn-reject"
                  onClick={() => updateOrderStatus(order._id, 'Rejected', order.userId)}
                >
                  ❌ Reject
                </button>
              </div>
            )}

            {order.status === 'In Process' && (
              <p className="status-accepted">✅ Order Accepted! It's now being processed...</p>
            )}

            {order.status === 'Confirmed' && (
              <p className="status-confirmed">✅ Order Confirmed & Ready to Deliver</p>
            )}

            {order.status === 'Rejected' && (
              <p className="status-rejected">❌ Order Rejected</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
