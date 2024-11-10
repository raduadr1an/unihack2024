import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import './Navbar.css';
import { auth } from '../firebaseConfig';
import logo from '../assets/hospital.svg';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [user, setUser] = useState(null);

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(setUser);

    return () => unsubscribe();
  }, []); 

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');  
    } catch (error) {
      console.error("Error logging out: ", error.message);
    }
  };

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
       
        {!user ? (
          <li>
            <Link
              to="/login"
              className={location.pathname === '/login' ? 'active' : ''}
            >
              LogIn
            </Link>
          </li>
        ) : (
          <>
          <li>
              <Link
                to="/search"
                className={location.pathname === '/search' ? 'active' : ''}
              >
                Search
              </Link>
            </li>
          <li>
              <Link
                to="/hd"
                className={location.pathname === '/hd' ? 'active' : ''}
              >
                Manage
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={location.pathname === '/profile' ? 'active' : ''}
              >
                Profile
              </Link>
            </li>
            <li onClick={handleLogout} id='logout'>
              LogOut
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
