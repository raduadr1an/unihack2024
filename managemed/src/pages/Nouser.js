import './nouser.css';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import noimg from '../assets/x.png'; // Correct default import

function Nouser() {
    return (
        <>
         <div className="no-user-container">
             <img src={noimg} alt="logo" id='no-user-container-x'/>
             <h2>No User Found</h2>
             <p>Please log in to view your account details.</p>
             <button onClick={() => auth.signOut()}>Log Out</button>
             <p>Forgot Password? <a href="/forgot-password">Reset Password</a></p>
             <p>Back to <a href="/">Home</a></p>
         </div>
        </>
    );
}
export default Nouser;