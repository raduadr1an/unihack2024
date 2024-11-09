import './Auth.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const checkEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setUsername(email);
    setEmailError(!checkEmail(email));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!checkEmail(username)) {
      setEmailError(true);
      return;
    }
    // test mode
    if (username === 'test@example.com' && password === 'test') {
      navigate('/profile');
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      console.log("User logged in:", userCredential.user);
      navigate('/profile'); // Removed .js extension
    } catch (error) {
      console.error("Error logging in:", error.message);
      navigate('/nouser'); // Handle invalid login case
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
