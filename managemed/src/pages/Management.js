import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig'; // Make sure you import the Firebase auth module
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function Management() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Set the user if logged in
      } else {
        navigate('/auth'); // Redirect to login if not logged in
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [navigate]); // Include navigate in the dependency array

  if (!user) {
    return null; // Optionally, show a loading spinner or a placeholder while waiting for auth state change
  }

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <p>Here is your management dashboard.</p>
      {/* Additional management content */}
    </div>
  );
}

export default Management;

