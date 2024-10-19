import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/authService";

// Role-based protected route
const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
  const userRole = AuthService.getUserRole();
  // console.log(userRole);
  const isLoggedIn = AuthService.isLoggedIn();

  // Check if user is logged in and has an allowed role
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
