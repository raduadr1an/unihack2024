import './admin.css';
import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig"; 
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";

function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); 
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);  // Default to false until verified
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Only allow access if the logged-in user is the admin (hardcoded email check)
      setIsAdmin(currentUser.email === "admin@managemd.unihack");
      if (currentUser.email === "admin@managemd.unihack") {
        fetchUsername(currentUser.uid);
      } else {
        // If not admin, redirect to login page
        // navigate('/login');
      }
    } else {
    //   navigate('/login');  // Redirect if no user is logged in
    }
  }, [navigate]);

  const fetchUsername = async (uid) => {
    const userRef = doc(db, "admins", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      setUsername(userDoc.data().username);
    }
  };
  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigate("/login"); 
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setSuccessMessage(`User ${userCredential.user.email} added successfully!`);
      setEmail("");
      setPassword("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };
  
  const handleSaveUsername = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, "admins", currentUser.uid);
        await setDoc(userRef, { username }, { merge: true });
        setSuccessMessage("Username updated successfully!");
      }
    } catch (error) {
      setErrorMessage("Error saving username: " + error.message);
    }
  };

  // If not admin, show an access denied message
//   if (!isAdmin) {
//     return <p>You do not have access to this page.</p>;
//   }

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>
      <h2>Add New User</h2>
      <form onSubmit={handleAddUser} className="add-user-form">
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="add-user-button">Add User</button>
      </form>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}

export default Admin;
