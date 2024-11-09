import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirect
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import './Navbar.css';

function Navbar({ user }) {
  const [logoutMessage, setLogoutMessage] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Show message when logout button becomes visible (i.e., user is logged in)
  useEffect(() => {
    if (user) {
      if (user.emailVerified) {
        // Show a message for verified email
        setLogoutMessage(`Welcome back, ${user.email}!`);
      } else {
        // Show a message for unverified email
        setLogoutMessage('Verification email sent. Please verify your email before logging in.');
      }
	setTimeout(() => {
        setLogoutMessage('');
      }, 2000); // Hide the message after 2 seconds
    }
  }, [user]); // This effect runs whenever the user state changes

  const handleLogout = async () => {
    await signOut(auth);  // Sign out the user
    navigate('/auth'); // Redirect to the /auth (login) page
  };

  return (
    <nav className="navbar">
      <ul className="nav-menu">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
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

