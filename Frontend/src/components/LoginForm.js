import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          kata_sandi: password, // Ensure this matches the backend expected key
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Store access token in localStorage
        localStorage.setItem('access_token', data.access_token);
  
        // Handle successful login
        console.log('Login successful:', data);
  
        // Role-based redirection
        switch (data.role) {
          case 'customer':
            navigate('/user/home');
            break;
          case 'cashier':
            navigate('/cashier');
            break;
          case 'kitchen':
            navigate('/kitchen');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/'); // Default route if role is not recognized
        }
      } else {
        // Handle login error
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };
  

  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Login Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-text">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-text">
            <i className="fas fa-key"></i>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">LOGIN</button>
        </form>
        <p>Don't have an account yet? <a href="/register">Create one</a></p>
      </div>
    </div>
  );
}

export default LoginForm;
