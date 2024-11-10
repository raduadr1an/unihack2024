import 'leaflet/dist/leaflet.css';
import './home.css';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import contactImage from '../assets/contactIcon.png';
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
              <div style={{textAlign:"center"}}>
              <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF26p9bDPnpfa9rfL-ESQVLLJFGLSYEydw2g&s'
		            alt=''
                style={{width: '600px',height: '400px',marginLeft:"20px"}}
                id="slideimg"
              />
              </div>
            </div>
            <h1 style={{fontFamily: "Faculty Glyphic"}}>Welcome to the ManageMed Application!</h1>
            <p>
              This application is designed to help medical professionals manage their patients' health data more efficiently.
            </p>
            <p>
              To get started, please <Link to="/login">LogIn</Link>
            </p>
          </div>

          <div className={`tab-content ${activeTab === 'about' ? 'active' : ''}`}>
          <div style={{textAlign:"center"}}><img style={{width: '600px',height: '400px',marginLeft:"30px"}}src="https://images.squarespace-cdn.com/content/v1/58b40fe1be65940cc4889d33/1579629445865-WYN8NL20RTPAPG7GS83K/_DSC2820.jpg"></img>
</div>
            <h1 style={{fontFamily: "Faculty Glyphic"}}>About Us</h1>
            <p>
              ManageMed is a cutting-edge application designed to help medical professionals manage their patients' health data more efficiently.
            </p>
            <p>
              Our mission is to create a safe, efficient, and accessible platform for patients to access and share their health data.
            </p>
          </div>

          <div className={`tab-content ${activeTab === 'contact' ? 'active' : ''}`}>
          <div style={{textAlign:"center"}}><img style={{width: '600px',height: '400px',marginLeft:"30px"}}src={contactImage}></img></div>
            <h1 style={{fontFamily: "Faculty Glyphic"}}>Contact Us</h1>
            <p>If you have any questions or need assistance, please don't hesitate to reach out.</p>
            <p>Email: support@managemed.com</p>
            <p>Phone: +1 (123) 456-7890</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;