import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserData({
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
      });
    } else {
      // navigate('/login');
    }
  }, [navigate]);

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <h1>Welcome, {userData.displayName || userData.email}!</h1>
      <p>Email: {userData.email}</p>
   </div>
  );
}

export default Profile;
