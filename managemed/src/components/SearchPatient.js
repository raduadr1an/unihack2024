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
                      levelID: level.floorNumber,
                      roomID: room.roomNumber,
                      patientID,
                      hospitalName: hospital.hospitalName,
                      levelName,
                      roomNumber,
                      ...patient,
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
    setSelectedPatient({
      hospitalID: result.hospitalID,
      levelID: result.levelID,
      roomID: result.roomID,
      patientID: result.patientID,
      pacientName: result.pacientName,
      pacientAge: result.pacientAge,
      pacientDiagnosis: result.pacientDiagnosis,
      doctorName: result.doctorName,
      pacientStatus: result.pacientStatus,
      hospitalName: result.hospitalName, // Ensure hospital name is passed
      levelName: result.levelName,       // Ensure level name is passed
      roomNumber: result.roomNumber      // Ensure room number is passed
    });
  };

  const closePatientDetails = () => {
    setSelectedPatient(null);
  };

  const updatePatientStatus = (
    hospitalID,
    levelID,
    roomID,
    patientID,
    status
  ) => {
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
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>

      <div className="results-container">
        {searchResults.map((result, index) => (
          <div key={index} className="result-card">
            <h2>{result.pacientName}</h2>
            <p>
              <strong>Hospital:</strong> {result.hospitalName}
            </p>
            <p>
              <strong>Level:</strong> {result.floorNumber}
            </p>
            <p>
              <strong>Room:</strong> {result.roomNumber}
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
              <button onClick={closePatientDetails} className="button-blue">
                Back to Search
              </button>
              <h1 className="title">Patient: {selectedPatient.pacientName}</h1>
              <p>
                <strong>Age:</strong> {selectedPatient.pacientAge}
              </p>
              <p>
                <strong>Diagnosis:</strong> {selectedPatient.pacientDiagnosis}
              </p>
              <p>
                <strong>Doctor:</strong> {selectedPatient.doctorName}
              </p>
              <p>
                <strong>Status:</strong> {selectedPatient.pacientStatus}
              </p>

              {/* Displaying Level and Room */}
              <p>
                <strong>Level:</strong> {selectedPatient.levelName}
              </p>
              <p>
                <strong>Room:</strong> {selectedPatient.roomNumber}
              </p>

              <button
                onClick={() =>
                  setEditingStatus((prevStatus) => ({
                    ...prevStatus,
                    [selectedPatient.patientID]: true,
                  }))
                }
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
                    onClick={() =>
                      updatePatientStatus(
                        selectedPatient.hospitalID,
                        selectedPatient.levelID,
                        selectedPatient.roomID,
                        selectedPatient.patientID,
                        newStatus
                      )
                    }
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
