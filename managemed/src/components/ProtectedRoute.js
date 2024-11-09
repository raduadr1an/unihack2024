import React from "react";
import { Route, Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig"; // Ensure you import Firebase auth

// Protected route for authenticated users only
const ProtectedRoute = ({ element, ...rest }) => {
  const currentUser = auth.currentUser;

  // Check if user is authenticated and an admin
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Check if the current user is an admin (this is an example)
  if (currentUser.email !== "admin@example.com") {
    return <Navigate to="/home" />;
  }

  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
