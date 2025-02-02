import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <h2 className="logo">Prismonix</h2>
        <nav className="nav-links">
          <Link to="/join-now" className="nav-button">Join Now</Link>
          <Link to="/sign-in" className="nav-button primary">Sign In</Link>
        </nav>
      </header>

      {/* Main Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="landing-title">Landing template for startups</h1>
          <p className="landing-description">
            Our landing page template works on all devices, so you only have to set it up once and get beautiful results forever.
          </p>
          <div className="hero-buttons">
            {/* <button className="landing-button">Pricing and Plans</button> */}
            <button className="landing-button secondary">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
