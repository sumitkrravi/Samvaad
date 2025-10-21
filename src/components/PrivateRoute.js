// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // agar token nahi hai to login page pe redirect kare
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
