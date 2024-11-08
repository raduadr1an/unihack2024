import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './Navbar.css';

function Navbar({ user }) {
  const [logoutMessage, setLogoutMessage] = useState('');
  const navigate = useNavigate(); // Create navigate function

  // Handle user logout
  const handleLogout = async () => {
    await signOut(auth);
    showLogoutMessage('You have been logged out.');
  };

  // Display a temporary logout message
  const showLogoutMessage = (message) => {
    setLogoutMessage(message);
    setTimeout(() => {
      setLogoutMessage('');
    }, 2000);
  };

  // Navigate to the Management page when logged in
  const handleGoToManagement = () => {
    navigate('/management');
  };

  return (
    <nav className="navbar">
      <ul className="nav-menu">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>

        {/* Show 'Go to Management' button instead of 'Login' when the user is logged in */}
        {user ? (
          <li className="nav-item">
            <Link to="/management" className="nav-link">Management</Link>
         </li>
        ) : (
          <li className="nav-item">
            <Link to="/auth" className="nav-link">Login</Link>
          </li>
        )}
      </ul>

      {user && (
        <div className="nav-user-info">
          <span className="user-email">Logged in as: {user.email}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      )}

      {logoutMessage && <div className="logout-notification">{logoutMessage}</div>}
    </nav>
  );
}

export default Navbar;

