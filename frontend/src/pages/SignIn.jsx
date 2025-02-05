import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/SignIn.css';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (response.data.token && response.data.role) {
        localStorage.setItem('token', response.data.token);
        const userRole = response.data.role;

        // Redirect based on user role
        if (userRole === 'Developer') {
          navigate('/developerhome');
        } else if (userRole === 'Innovator') {
          navigate('/innovatorhome');
        } else if (userRole === 'Investor') {
          navigate('/investorhome');
        } else {
          setErrorMessage('Unknown user role.');
        }
      }
    } catch (err) {
      setErrorMessage('Invalid credentials. Please try again or register.');
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="signin-button" type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
