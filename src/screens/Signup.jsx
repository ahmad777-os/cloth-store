import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Signup.css';
import '../css/font.css';
const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, adminCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);

        // ✅ Store user info in localStorage
        localStorage.setItem('user', JSON.stringify({
          userId: data.userId,
          fullName: data.fullName,
          role: data.role
        }));

        // ✅ Redirect to homepage or login
        navigate('/');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Server error');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          type="text"
          placeholder="Full Name"
          required
        /><br />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
        /><br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
        /><br />
        <input
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
          type="text"
          placeholder="Admin Code (optional)"
        /><br />
        <button type="submit">Create Account</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;
