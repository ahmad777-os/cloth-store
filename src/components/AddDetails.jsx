import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../css/font.css';
import '../css/AddDetails.css';

const AddDetails = ({ cartItems, userId, onOrderPlaced }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!userId) {
      setError('User is not logged in.');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);

    const deliveryDetails = {
      fullName,
      phoneNumber,
      address,
      city,
      postalCode,
      country,
    };

    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    try {
      await axios.post('http://localhost:5000/api/orders', {
        userId,
        items: cartItems,
        deliveryDetails,
        total,
      });

      setLoading(false);
      setSuccess(true);

      // Reset form
      setFullName('');
      setPhoneNumber('');
      setAddress('');
      setCity('');
      setPostalCode('');
      setCountry('');

      onOrderPlaced(); // trigger UI update
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
        'Failed to place order. Please try again.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-details-form">
      <h2>Delivery Details</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Order placed successfully!</p>}

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Postal Code"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  );
};

AddDetails.propTypes = {
  cartItems: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
  onOrderPlaced: PropTypes.func.isRequired,
};

export default AddDetails;
