import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
        setOrder(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch order', err);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePayment = async () => {
    try {
      await axios.post(`http://localhost:5000/api/orders/${orderId}/payment`);
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: 'Confirmed',
      });

      await axios.post(`http://localhost:5000/api/notifications`, {
        userId: order.userId,
        orderId,
        message: 'Your payment was successful! Order is confirmed and ready to deliver.',
      });

      navigate('/order-success');
    } catch (err) {
      console.error('Payment failed', err);
    }
  };

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Pay for Order</h2>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Total:</strong> ${order.total}</p>
      <button onClick={handlePayment} style={{ marginTop: 20 }}>Pay Now</button>
    </div>
  );
};

export default Payment;
