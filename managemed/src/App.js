import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Auth';
import Profile from './pages/Profile';
import NoUser from './pages/NoUser';
import Navbar from './components/Navbar';
import ForgotPassword from './pages/ForgetPassword'; 
import Admin from './pages/Admin';
import HospitalData from './components/HospitalData/HospitalData';
import Search from './components/SearchPatient';
function App() {
  return (
    <Router>
      <Navbar />
      <br></br>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/nouser" element={<NoUser />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/hd" element={<HospitalData />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
