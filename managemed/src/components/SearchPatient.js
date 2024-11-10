import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./searchbar.css";

function SearchPatient() {
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const hospitalsRef = ref(database, "hospital");
    onValue(hospitalsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const hospitalsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setHospitals(hospitalsArray);
      }
    });
  }, []);

  const handleSearch = () => {
    const results = [];
    hospitals.forEach((hospital) => {
      if (hospital.floor) {
        Object.keys(hospital.floor).forEach((levelID) => {
          const level = hospital.floor[levelID];
          if (level.roomInfo) {
            Object.keys(level.roomInfo).forEach((roomID) => {
              const room = level.roomInfo[roomID];
              if (room.pacientInfo) {
                Object.keys(room.pacientInfo).forEach((patientID) => {
                  const patient = room.pacientInfo[patientID];
                  if (
                    patient.pacientName &&
                    patient.pacientName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  ) {
                    results.push({
                      hospitalID: hospital.id,
                      levelID,
                      roomID,
                      patientID,
                      hospitalName: hospital.hospitalName,
                      levelName: level.floorNumber,
                      roomNumber: room.roomNumber,
                      patientName: patient.pacientName,
                    });
                  }
                });
              }
            });
          }
        });
      }
    });

    setSearchResults(results);
  };
  const navigateToPatient = (hospitalID, levelID, roomID, patientID) => {
    navigate(`/hd`);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a patient"
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>

      <div className="results-container">
        {searchResults.map((result, index) => (
          <div key={index} className="result-card">
            <h2>{result.patientName}</h2>
            <p>
              <strong>Hospital:</strong> {result.hospitalName}
            </p>
            <p>
              <strong>Level:</strong> {result.levelName}
            </p>
            <p>
              <strong>Room:</strong> {result.roomNumber}
            </p>
            <button
              className="view-details-button"
              onClick={() =>
                navigateToPatient(
                  result.hospitalID,
                  result.levelID,
                  result.roomID,
                  result.patientID
                )
              }
            >
              View Patient Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPatient;
