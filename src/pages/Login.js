import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import "./Login.css";

export default function Login() {
  const [credentials, setCredentials] = useState({ loginId: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <h2>Welcome Back 👋</h2>
        <div className="input-group">
          <input
            type="text"
            name="loginId"
            value={credentials.loginId}
            onChange={handleChange}
            required
            placeholder=" "
          />
          <label>Username or Email</label>
        </div>
        <div className="input-group password-group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder=" "
          />
          <label>Password</label>
          <span className="toggle-password" onClick={togglePassword}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <button type="submit" className="login-btn">Login</button>
        {error && <p className="error">{error}</p>}
        <p className="signup-link">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
        <div className="social-login">
          <p>Or continue with</p>
          <div className="social-icons">
            <button type="button" className="google-btn"><FcGoogle size={20} /> Google</button>
          </div>
        </div>
      </form>
    </div>
  );
}
