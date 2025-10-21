// src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ username }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <a className="navbar-brand d-flex align-items-center" href="#">
        <img src="/logo192.png" alt="Samvaad Logo" width="40" className="me-2"/>
        <span>Samvaad</span>
      </a>

      <div className="ms-auto d-flex align-items-center gap-3">
        <span className="text-white">
          {username && username.charAt(0).toUpperCase() + username.slice(1)}
          <span className="badge bg-success ms-2" style={{width:'10px', height:'10px', borderRadius:'50%'}}></span>
        </span>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
