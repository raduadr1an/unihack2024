import React, { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import TaskManager from "./HospitalData/TaskManager";
import "./searchbar.css";

function SearchPatient() {
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingStatus, setEditingStatus] = useState({});
  const [newStatus, setNewStatus] = useState("");
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
                      ...patient
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

  const viewPatientDetails = (result) => {
    setSelectedPatient(result);
  };

  const closePatientDetails = () => {
    setSelectedPatient(null);
  };

  const updatePatientStatus = (hospitalID, levelID, roomID, patientID, status) => {
    const patientStatusRef = ref(
      database,
      `hospital/${hospitalID}/floor/${levelID}/roomInfo/${roomID}/pacientInfo/${patientID}/pacientStatus`
    );
    set(patientStatusRef, status);
    setEditingStatus((prevStatus) => ({ ...prevStatus, [patientID]: false }));
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a patient"
        className="search-input"
	onKeyPress={(e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }}
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>

      <div className="results-container">
        {searchResults.map((result, index) => (
          <div key={index} className="result-card">
            <h2>Patient Name: <strong>{result.pacientName}</strong></h2>
            <p>
              <strong>Hospital:</strong> {result.hospitalName}
            </p>
	    <p>
              <strong>{result.levelName}</strong>
            </p>
            <p>
              <strong>Room {result.roomNumber}</strong>
            </p>
            <button
              className="view-details-button"
              onClick={() => viewPatientDetails(result)}
            >
              View Patient Details
            </button>
          </div>
        ))}
      </div>

      {selectedPatient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div>
              <button onClick={closePatientDetails} className="button-blue">Back to Search</button>
              <h1 className="title">Patient: {selectedPatient.pacientName}</h1>
              <p>Age: {selectedPatient.pacientAge}</p>
              <p>Diagnosis: {selectedPatient.pacientDiagnosis}</p>
              <p>Doctor: {selectedPatient.doctorName}</p>
              <p>Status: {selectedPatient.pacientStatus}</p>
              
              <button
                onClick={() => setEditingStatus((prevStatus) => ({ 
                  ...prevStatus, 
                  [selectedPatient.patientID]: true 
                }))}
                className="button-blue"
              >
                Edit Status
              </button>

              {editingStatus[selectedPatient.patientID] && (
                <div>
                  <input
                    type="text"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    placeholder="Enter new status"
                  />
                  <button 
                    onClick={() => updatePatientStatus(
                      selectedPatient.hospitalID,
                      selectedPatient.levelID,
                      selectedPatient.roomID,
                      selectedPatient.patientID,
                      newStatus
                    )} 
                    className="button-blue"
                  >
                    Save Status
                  </button>
                </div>
              )}

              <div>
                <TaskManager
                  hospitalID={selectedPatient.hospitalID}
                  levelID={selectedPatient.levelID}
                  roomID={selectedPatient.roomID}
                  patientID={selectedPatient.patientID}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPatient;
