import React, { useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import "./Signup.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://samvaad-backend-925t.onrender.com/api/auth/signup", formData);
      setSuccess("Signup successful! You can now login.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setSuccess("");
    }
  };

  

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-card">
        <div className="form-section">
          <h2>Sign Up</h2>

          <div className="row">
            <div className="col">
              <div className="input-group">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label>Username</label>
              </div>
            </div>
            <div className="col">
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label>Full Name</label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label>Email</label>
              </div>
            </div>
            <div className="col">
              <div className="input-group password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label>Password</label>
                <span className="toggle-password" onClick={togglePassword}>
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        <p className="Login-link">
          Already have an account? <a href="/login">Login</a>
        </p>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </div>

        {/* <div className="social-section">
          <p className="or-text">OR</p>
          <div className="social-login">
            <button className="google-btn">
              <FcGoogle size={22} style={{ marginRight: "8px" }} /> Sign up with Google
            </button>
            <button className="github-btn">
              <FaGithub size={20} style={{ marginRight: "8px" }} /> Sign up with GitHub
            </button>
          </div>
        </div> */}
      </form>
    </div>
  );
}
