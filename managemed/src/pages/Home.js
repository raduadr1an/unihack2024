import 'leaflet/dist/leaflet.css';
import './home.css';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import L from "leaflet";

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('welcome');
  const slides = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF26p9bDPnpfa9rfL-ESQVLLJFGLSYEydw2g&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyhl9M52gI85WkxMFuAj19MLZlCbKYaNoveg&s',
    'https://i0.1616.ro/media/2/2701/33586/20420158/1/whatsapp-image-2021-10-06-at-17-08-58.jpg?width=860',
    'https://spitalulconstanta.ro/wp-content/uploads/2022/01/spital-FB6-2.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkAaAtz7JD3ip8x2PRIIOeElOt_XioVhhAtA&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBAP3fQL4lZvZq9vmMn9_4jFEUGKH042zL9w&s',
  ];

  // Only initialize the map once the component has been mounted
  useEffect(() => {
    // Initialize the map only if the container exists
    const mapContainer = document.getElementById('map');
    let map = null;

    if (mapContainer) {
      map = L.map(mapContainer).setView([51.505, -0.09], 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([51.5, -0.09]).addTo(map)
        .bindPopup('A pretty CSS popup.<br> Easily customizable.')
        .openPopup();
    }

    // Cleanup function to remove the map when the component unmounts
    return () => {
      if (map) {
        map.remove(); // This removes the map properly
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once


  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000); 

    return () => clearInterval(slideInterval); 
  }, []);

  return (
    <>
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
              onClick={() => setActiveTab('hospitals')}
              className={activeTab === 'hospitals' ? 'active' : ''}
            >
              Hospitals
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
                src={slides[currentSlide]}
                alt={`Slide ${currentSlide + 1}`}
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

          <div className={`tab-content ${activeTab === 'hospitals' ? 'active' : ''}`}>
          <div id="map" style={{ height: '400px' }}>Aici</div>
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
