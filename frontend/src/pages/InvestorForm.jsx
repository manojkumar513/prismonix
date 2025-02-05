import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/InnovatorForm.css";
import { jwtDecode } from "jwt-decode"; // Add this package to decode JWT tokens

const InvestorForm = () => {
  const [formData, setFormData] = useState({
    location: "",
    education: "",
    investmentFocus: "",
    capitalRange: "",
    investmentStage: "",
    portfolioCompanies: "",
    portfolioUrl: "",
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isTokenValid = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decodedToken.exp > currentTime; // Check if token is expired
    } catch (error) {
      return false; // Token is invalid
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      alert("Please accept the terms and conditions to proceed.");
      return;
    }

    // Retrieve the token securely
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication token not found. Please log in again.");
      navigate("/sign-in");
      return;
    }

    // Check if the token is valid and not expired
    if (!isTokenValid(token)) {
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("token"); // Clear expired token
      navigate("/sign-in");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/investor-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Profile saved successfully!");
        navigate("/investorhome");
      } else if (response.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token"); // Clear expired token
        navigate("/join-now");
      } else {
        const errorData = await response.json();
        alert(`Failed to save profile: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving profile data:", error);
      alert("An error occurred while saving the profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="investor-profile-container">
      <h1>Create Your Investor Profile</h1>
      <form onSubmit={handleSubmit} className="investor-profile-form">
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="education">Education:</label>
          <input
            type="text"
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="investmentFocus">Investment Focus:</label>
          <input
            type="text"
            id="investmentFocus"
            name="investmentFocus"
            value={formData.investmentFocus}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="capitalRange">Capital Range:</label>
          <input
            type="text"
            id="capitalRange"
            name="capitalRange"
            value={formData.capitalRange}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="investmentStage">Investment Stage:</label>
          <input
            type="text"
            id="investmentStage"
            name="investmentStage"
            value={formData.investmentStage}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="portfolioCompanies">Portfolio Companies:</label>
          <textarea
            id="portfolioCompanies"
            name="portfolioCompanies"
            value={formData.portfolioCompanies}
            onChange={handleChange}
            disabled={loading}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="portfolioUrl">Portfolio URL:</label>
          <input
            type="url"
            id="portfolioUrl"
            name="portfolioUrl"
            value={formData.portfolioUrl}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group terms">
          <input
            type="checkbox"
            id="termsAccepted"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            disabled={loading}
          />
          <label htmlFor="termsAccepted">
            I accept the terms and conditions.
          </label>
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default InvestorForm;
