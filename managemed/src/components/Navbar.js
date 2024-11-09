import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';
import { auth } from '../firebaseConfig';
import logo from '../assets/hospital.svg';

function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Check if a user is logged in when the component mounts
  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);

    // Optionally, you could subscribe to changes in auth state
    // auth.onAuthStateChanged(setUser);

  }, []);

  return (
    <nav>
      <Link to="/" className="logo-link">
        <img src={logo} className="App-logo-nav logo-flip" alt="logo" />
      </Link>
      <ul>
        <li>
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
          >
            Home
          </Link>
        </li>
        {!user && (
          <li>
            <Link
              to="/login"
              className={location.pathname === '/login' ? 'active' : ''}
            >
              LogIn
            </Link>
          </li>
        )}
        {user && (
          <li>
            <Link
              to="/profile"
              className={location.pathname === '/profile' ? 'active' : ''}
            >
              Profile
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
