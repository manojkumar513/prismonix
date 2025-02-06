import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "C:/Users/manoj555/Desktop/prismonix_chatgpt/frontend/src/styles/DeveloperForm.css";
import { jwtDecode } from "jwt-decode"; // Add this package to decode JWT tokens

const DeveloperForm = () => {
  const [formData, setFormData] = useState({
    location: "",
    definesYou: "",
    education: "",
    skills: "",
    preferredEmploymentType: "",
    preferredWorkEnvironment: "",
    experience: "",
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
      const response = await fetch("http://localhost:5000/api/auth/developer-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Profile saved successfully!");
        navigate("/developerhome");
      } else if (response.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token"); // Clear expired token
        navigate("/login");
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
    <div className="developer-profile-container">
      <form className="developer-profile-form" onSubmit={handleSubmit}>
        <h2>Create your Developer profile</h2>

        <div className="form-group">
          <label>Where are you from?</label>
          <input
            type="text"
            placeholder="Current location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>What Describes your Current Role?</label>
          <select
            name="definesYou"
            value={formData.definesYou}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Full stack Developer">Full stack Developer</option>
          </select>
        </div>


        <div className="form-group">
          <label htmlFor="Education">Education</label>
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
          <label>How Many Years of experience do you have in your current role?</label>
          <select
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="0-1 Years">0-1 Years</option>
            <option value="1-2 Years">1-2 Years</option>
          </select>
        </div>

        <div className="form-group">
          <label>Skills</label>
          <select
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Backend Development">Backend Development</option>
          </select>
        </div>

        <div className="form-group">
          <label>Preferred Employment Type</label>
          <select
            name="preferredEmploymentType"
            value={formData.preferredEmploymentType}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>

        <div className="form-group">
          <label>Preferred Work Environment</label>
          <select
            name="preferredWorkEnvironment"
            value={formData.preferredWorkEnvironment}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              disabled={loading}
            />
            I accept the terms and conditions
          </label>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default DeveloperForm;