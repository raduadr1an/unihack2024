import './nouser.css';
import React from 'react';
import noimg from '../assets/x.png';

function NoUser() {
    return (
        <>
         <div className="no-user-container">
             <img src={noimg} alt="logo" id='no-user-container-x'/>
             <h2>No User Found</h2>
             <p>Please log in to view your account details.</p>
             <p>Forgot Password? <a href="/forgot-password">Reset Password</a></p>
             <p>Back to <a href="/">Home</a></p>
         </div>
        </>
    );
}
export default NoUser;
