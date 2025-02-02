import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigation hook
import axios from 'axios';
import '../styles/JoinNow.css';

function JoinNow() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Developer',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize the navigation hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      setSuccessMessage('Registration Successful!');
      setErrorMessage('');

      // Navigate based on role after a short delay
      setTimeout(() => {
        if (formData.role === 'Developer') {
          navigate('/developer-form');
        } else if (formData.role === 'Innovator') {
          navigate('/innovator-form');
        } else if (formData.role === 'Investor') {
          navigate('/investor-form');
        }
      }, 1000);
    } catch (err) {
      setSuccessMessage('');
      setErrorMessage('Error registering user. Please try again.');
    }
  };

  return (
    <div className="joinnow-container">
      <h2 className="joinnow-title">Join Now</h2>
      <form onSubmit={handleSubmit} className="joinnow-form">
        <div className="input-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="Developer">Developer</option>
            <option value="Innovator">Innovator</option>
            <option value="Investor">Investor</option>
          </select>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="joinnow-button">Register</button>
      </form>
    </div>
  );
}

export default JoinNow;
