import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterForm.css';

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/register', {
        nama_pengguna: formData.fullname,
        username: formData.username,
        email: formData.email,
        kata_sandi: formData.password
      });
      console.log(response.data);
      navigate('/user/home');
    } catch (err) {
      console.error('Error Details:', err); // Log full error details
      if (err.response) {
        console.error('Response Data:', err.response.data);
        console.error('Response Status:', err.response.status);
        console.error('Response Headers:', err.response.headers);
        setError(err.response.data.error);
      } else if (err.request) {
        console.error('Request Data:', err.request);
        setError('No response received from server.');
      } else {
        console.error('Error Message:', err.message);
        setError('An error occurred.');
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-form">
        <h2>Register Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-text">
            <i className="fas fa-address-card"></i>
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder='Full Name'
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-text">
            <i className="fas fa-user"></i>
            <input
              type="text"
              id="username"
              name="username"
              placeholder='Username'
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-text">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='Email Address'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-text">
            <i className="fas fa-key"></i>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">REGISTER</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>Already have an account? <a href="/">Login</a></p>
      </div>
    </div>
  );
}

export default RegisterForm;
