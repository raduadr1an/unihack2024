import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Management from './pages/Management'; // Add Management page import
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

function App() {
  const [user, setUser] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        {/* Home page is visible to everyone */}
        <Route path="/" element={<Home />} />
        
        {/* Auth page is visible only to logged out users */}
        <Route
          path="/auth"
          element={!user ? <Auth setUser={setUser} /> : <Navigate to="/management" />}
        />
        
        {/* Management page is only accessible when logged in */}
        <Route
          path="/management"
          element={user ? <Management /> : <Navigate to="/auth" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

