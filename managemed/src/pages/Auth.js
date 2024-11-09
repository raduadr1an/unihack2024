import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, database } from '../firebaseConfig';
import { set, ref } from 'firebase/database';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Auth.css'

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [notification, setNotification] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Regex for basic email and password validation
  const isPasswordValid = (password) => /^(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  const isEmailValid = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/management'); // Redirect to management page if user is logged in
    }
  }, []);

  // Function to show a notification message
  const showMessage = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 3000); // Display for 3 seconds
  };

  // Main authentication handler
  const handleAuth = async (e) => {
    e.preventDefault();

    // Validate email and password
    if (!isEmailValid(email) || !isPasswordValid(password)) {
      showMessage('Invalid email or password. Password must be at least 8 characters long and include a digit.');
      return;
    }

    try {
      if (isLogin) {
        // Logging in the user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if email is verified
        if (!user.emailVerified) {
          await auth.signOut();  // Log the user out if email is not verified
          return;
        }

        // Navigate to the /management page after successful login
        showMessage(`Welcome back, ${user.email}! You have successfully logged in.`);
        navigate('/management');  // Redirect to the management page
      } else {
        // Registering a new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send verification email
        await sendEmailVerification(user);

        // Setting up a default 'pacient' role in the database
        await set(ref(database, `users/${user.uid}`), {
          email: user.email,
          createdAt: new Date().toISOString(),
          accountType: 'pacient',
        });

        setEmail('');
        setPassword('');
	navigate('/management');
      }
    } catch (error) {
      // Error handling
      console.error('Error during authentication:', error);

      if (error.code === 'auth/invalid-credential') {
        showMessage('Incorrect password or email. Please try again.');
      } else if (error.code === 'auth/email-already-in-use') {
        showMessage('There already exists an account associated with this email address.');
      } else {
        showMessage('An unexpected error occurred. Please try again.');
      }
      setPassword('');
    }
  };

  return (
    <div className="auth-container">
      <h1>{isLogin ? 'Login' : 'Register'}</h1>

      {/* Notification message */}
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

        {/* Toggle between Login and Register */}
        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Auth;

