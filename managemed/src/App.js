import Navbar from './components/Navbar';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
<<<<<<< Updated upstream
=======
import logo from './assets/hospital.svg';
import './App.css';
import Profile from './pages/Profile.js';   
import Login from './pages/Auth.js';     
import Nouser from './pages/Nouser.js';
>>>>>>> Stashed changes

function App() {
  return (
    // Navigation bar
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/nouser" element={<Nouser />} /> 
      </Routes>
    </Router>

  );
}
export default App;
