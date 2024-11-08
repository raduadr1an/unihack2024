import React, { useState } from 'react';
import { auth, database } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import './Auth.css';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [notification, setNotification] = useState('');
  const [resetPassword, setResetPassword] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false); // New state to track the reset status

  // Display a temporary message for 2 seconds
  const showMessage = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 2000);
  };

  // Validate password requirements
  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  // Validate email format
  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Handle form submission for login or signup
  const handleAuth = async (e) => {
    e.preventDefault();

    // Email and password validation
    if (!isEmailValid(email)) {
      showMessage('Please enter a valid email address.');
      setEmail('');
      return;
    }

    if (!isPasswordValid(password)) {
      showMessage('Password must be at least 8 characters long and include at least one digit.');
      setPassword('');
      return;
    }

    try {
      if (isLogin) {
        // Login with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        showMessage(`Welcome back, ${userCredential.user.email}!`);
      } else {
        // Sign up with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user information in Realtime Database
        await set(ref(database, `users/${user.uid}`), {
          email: user.email,
          createdAt: new Date().toISOString(),
        });
        showMessage(`Account created successfully for ${user.email}!`);
      }

      // Clear fields after successful authentication
      setEmail('');
      setPassword('');
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        showMessage('Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        showMessage('No account found with this email address.');
      } else {
        showMessage(`Error: ${error.message}`);
      }
      setPassword(''); // Clear the password field in case of error but keep email
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    if (!isEmailValid(email)) {
      showMessage('Please enter a valid email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showMessage('Password reset email sent. Please check your inbox.');

      // Hide the reset section after 2 seconds
      setIsResetSent(true);
      setTimeout(() => {
        setResetPassword(false);
        setIsResetSent(false); // Reset the state after hiding the section
      }, 2000);
    } catch (error) {
      showMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="auth-container">
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      {notification && <div className="notification">{notification}</div>}
      <form onSubmit={handleAuth} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        {isLogin && !resetPassword && (
          <p>
            Forgot your password?{' '}
            <button type="button" onClick={() => setResetPassword(true)}>
              Reset Password
            </button>
          </p>
        )}
        {resetPassword && !isResetSent && (
          <div>
            <p>We will send a password reset email to {email}</p>
            <button type="button" onClick={handlePasswordReset}>
              Send Reset Email
            </button>
          </div>
        )}
        {isResetSent && (
          <p>Password reset email sent. Please check your inbox.</p>
        )}
        <p>
          {isLogin ? 'New here?' : 'Already have an account?'}{' '}
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Create an account' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Auth;

