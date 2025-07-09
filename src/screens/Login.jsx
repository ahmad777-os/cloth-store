import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Login.css';
import '../css/font.css';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            userId: data.userId,
            fullName: data.fullName,
            email,
            role: data.role,
            token: data.token,
          })
        );

        // Inform other components like Navbar
        window.dispatchEvent(new Event('userUpdated'));

        // Redirect to home
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Server error, please try again later.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
        />
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Don’t have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
