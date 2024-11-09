import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Change here
import Home from './pages/Home';
import Login from './pages/Auth';
import Profile from './pages/Profile';
import NoUser from './pages/Nouser';
import Navbar from './components/Navbar';
import ForgotPassword from './pages/ForgetPassword'; 
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  return (
    <Router> {/* Use BrowserRouter here */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/nouser" element={<NoUser />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route   path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
