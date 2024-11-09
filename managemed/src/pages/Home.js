import 'leaflet/dist/leaflet.css';
import './home.css';
import { Link} from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import SearchBar from '../components/searchbar';
function Home() {


    const cords = [
      [45.737672, 21.241339],
      [45.769064, 21.259080],
      [45.768907, 21.259327],
      [45.759192, 21.227053],
      [45.753433, 21.221729],
      [45.757083, 21.224965],
      [45.744790, 21.232735],
      [45.782549, 20.715953],
      [46.068387, 20.636348],
      [45.690416, 21.888638],
    ];
  
    const [activeHospital, setActiveHospital] = useState(null);
  
    const mapRef = useRef(null);
  
    const hospitals = [
      { id: 1, name: 'County Emergency Clinical Hospital "Pius Brînzeu" Timișoara', address: 'Str. Liviu Rebreanu 156, Timișoara', services: 'General and emergency medical services, surgery, intensive care', cord: cords[0] },
      { id: 2, name: 'Institute of Cardiovascular Diseases Timișoara', address: 'Str. Gheorghe Adam 13A, Timișoara', services: 'Specialized in cardiovascular treatment and surgery', cord: cords[1] },
      { id: 3, name: 'Victor Babeș Infectious Diseases and Pneumology Clinical Hospital', address: 'Str. Gheorghe Adam 13, Timișoara', services: 'Infectious diseases, pulmonology, COVID-19 care', cord: cords[2] },
      { id: 4, name: 'Municipal Clinical Emergency Hospital Timișoara', address: 'Str. Gheorghe Dima 5, Timișoara', services: 'General healthcare services, emergency, and trauma', cord: cords[3] },
      { id: 5, name: 'Louis Țurcanu Children\'s Emergency Hospital', address: 'Str. Iosif Nemoianu 2, Timișoara', services: 'Pediatric care, emergency services for children', cord: cords[4] },
      { id: 6, name: 'Military Emergency Clinical Hospital "Dr. Victor Popescu" Timișoara', address: 'Str. Gheorghe Barițiu 19-21, Timișoara', services: 'Emergency and general services, military personnel healthcare', cord: cords[5] },
      { id: 7, name: 'Timișoara Institute of Oncology', address: 'Bulevardul Victor Babeș, Timișoara', services: 'Cancer treatment, oncology, radiotherapy', cord: cords[6] },
      { id: 8, name: 'Dr. Karl Diel Hospital, Jimbolia', address: 'Str. Republicii 93, Jimbolia, Timiș County', services: 'General medicine, outpatient care', cord: cords[7] },
      { id: 9, name: 'Sânnicolau Mare City Hospital', address: 'Str. Republicii 15, Sânnicolau Mare, Timiș County', services: 'General and emergency care, outpatient services', cord: cords[8] },
      { id: 10, name: 'Lugoj Municipal Hospital', address: 'Str. Gheorghe Lazăr 16, Lugoj, Timiș County', services: 'General healthcare services, outpatient and inpatient care', cord: cords[9] },
    ];
  
    useEffect(() => {
      if (mapRef.current) {
        const map = L.map(mapRef.current).setView(cords[0], 15);
        L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(map);
  
        mapRef.current = map;
      }
    }, []); 
    useEffect(() => {
      if (activeHospital && mapRef.current) {
        const { cord } = activeHospital;
        const map = mapRef.current;
  
        map.setView(cord, 15);
  
        L.marker(cord).addTo(map)
          .bindPopup(`<strong>${activeHospital.name}</strong><br>${activeHospital.address}`)
          .openPopup();
      }
    }, [activeHospital]);




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

  return (
    <>
    <SearchBar />
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
          <div className="hospital-map-container">
              <div className="hospital-options">
                <ul>
                  {hospitals.map((hospital) => (
                    <li
                      key={hospital.id}
                      onClick={() => setActiveHospital(hospital)}
                      className={activeHospital?.id === hospital.id ? 'active' : ''}
                    >
                      <strong>{hospital.name}</strong>
                      <p><strong>Address:</strong> {hospital.address}</p>
                      <p><strong>Services:</strong> {hospital.services}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div id="map" style={{ height: '500px', width: '100%' }}></div>
            </div>
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
