import 'leaflet/dist/leaflet.css';
import './home.css';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
function Home() {
  
  const [activeTab, setActiveTab] = useState('welcome');
  
  return (
    <>
    {/* <SearchBar /> */}
      <div className="flex">
        <div className="options">
          <ul>
            <li
              onClick={() => setActiveTab('welcome')}
              className={activeTab === 'welcome' ? 'active' : ''}
            >
              Welcome
            </li>
            <li
              onClick={() => setActiveTab('about')}
              className={activeTab === 'about' ? 'active' : ''}
            >
              About Us
            </li>
            <li
              onClick={() => setActiveTab('contact')}
              className={activeTab === 'contact' ? 'active' : ''}
            >
              Contact
            </li>
          </ul>
        </div>

        <div className="show">
          <div className={`tab-content ${activeTab === 'welcome' ? 'active' : ''}`}>
            <div className="slideshow">
              <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF26p9bDPnpfa9rfL-ESQVLLJFGLSYEydw2g&s'
		alt=''
                style={{ width: '100%', height: 'auto' }}
                id="slideimg"
              />
            </div>
            <h1>Welcome to the ManageMed Application!</h1>
            <p>
              This application is designed to help medical professionals manage their patients' health data more efficiently.
            </p>
            <p>
              To get started, please <Link to="/login">LogIn</Link>
            </p>
          </div>

          <div className={`tab-content ${activeTab === 'about' ? 'active' : ''}`}>
            <h2>About Us</h2>
            <p>
              ManageMed is a cutting-edge application designed to help medical professionals manage their patients' health data more efficiently.
            </p>
            <p>
              Our mission is to create a safe, efficient, and accessible platform for patients to access and share their health data.
            </p>
          </div>

          <div className={`tab-content ${activeTab === 'contact' ? 'active' : ''}`}>
            <h2>Contact Us</h2>
            <p>If you have any questions or need assistance, please don't hesitate to reach out.</p>
            <p>Email: support@managemed.com</p>
            <p>Phone: +1 (123) 456-7890</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
