import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/InnovatorForm.css";
import { jwtDecode } from "jwt-decode"; // Add this package to decode JWT tokens

const InnovatorForm = () => {
  const [formData, setFormData] = useState({
    location: "",
    education: "",
    currentRole: "",
    skills: "",
    industryFocus: "",
    expertise: "",
    innovationCategories: "",
    collaborationType: "",
    needs: "",
    portfolioURL: "",
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
      const response = await fetch("http://localhost:5000/api/auth/innovator-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Profile saved successfully!");
        navigate("/innovatorhome");
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
    <div className="profile-creation-container">
      <h1>Innovator Profile Creation</h1>
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="education">Education</label>
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
          <label htmlFor="currentRole">Current Role</label>
          <input
            type="text"
            id="currentRole"
            name="currentRole"
            value={formData.currentRole}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="skills">Skills</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="industryFocus">Industry Focus</label>
          <input
            type="text"
            id="industryFocus"
            name="industryFocus"
            value={formData.industryFocus}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="expertise">Expertise</label>
          <input
            type="text"
            id="expertise"
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="innovationCategories">Innovation Categories</label>
          <input
            type="text"
            id="innovationCategories"
            name="innovationCategories"
            value={formData.innovationCategories}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="collaborationType">Collaboration Type</label>
          <input
            type="text"
            id="collaborationType"
            name="collaborationType"
            value={formData.collaborationType}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="needs">Needs</label>
          <input
            type="text"
            id="needs"
            name="needs"
            value={formData.needs}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="portfolioURL">Portfolio URL</label>
          <input
            type="url"
            id="portfolioURL"
            name="portfolioURL"
            value={formData.portfolioURL}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              disabled={loading}
            />
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

export default InnovatorForm;
