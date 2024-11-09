import './Auth.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  // Regular expression to check if the email is valid
  
  const checkEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Handling email input change and checking if it's valid
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setUsername(email);
    setEmailError(!checkEmail(email)); // Set error if email is invalid
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    // If the credentials match the admin credentials, redirect to the admin panel
    if (username === 'admin@managemd.unihack' && password === 'RCSD1234') {
      navigate('/admin');  // Admin credentials hardcoded to navigate to admin panel
      return;  // Stop further execution since admin is redirected
    }

    // Validate if the entered username is a valid email
    if (!checkEmail(username)) {
      setEmailError(true);  // If email is not valid, show error message
      return;  // Stop execution if the email is invalid
    }

    // Firebase authentication for regular users
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      console.log("User logged in:", userCredential.user);
      navigate('/profile');  // Redirect to profile page for regular users
    } catch (error) {
      console.error("Error logging in:", error.message);
      navigate('/nouser');  // Redirect to /nouser if login fails
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Email</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleEmailChange}
              required
            />
            {emailError && <p style={{ color: 'red' }}>Not a valid Email</p>}
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">LogIn</button>

        </form>
      </div>
    </div>
  );
}

export default Auth;
