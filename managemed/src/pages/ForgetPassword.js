import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (event) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent!");
    } catch (error) {
      setMessage("Error sending password reset email.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Reset Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
