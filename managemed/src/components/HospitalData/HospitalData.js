import React, { useEffect, useState } from "react";
import { ref, onValue, set, push, remove } from "firebase/database";
import {database} from '../../firebaseConfig';
import "./HospitalData.css";
import TaskManager from "./TaskManager";

function HospitalData() {
  const [hospitals, setHospitals] = useState([]);
  const [hospitalName, setHospitalName] = useState(""); // For new hospital
  const [levelName, setLevelName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [patientDetails, setPatientDetails] = useState({
    pacientName: "",
    pacientAge: "",
    pacientDiagnosis: "",
    doctorName: "",
    pacientStatus: ""
  });
  const [patientID1, setPatientID1] = useState("");
  const [editingStatus, setEditingStatus] = useState({});
  const [newStatus, setNewStatus] = useState("");
  const updatePatientStatus = (patientID, status) => {
    const patientStatusRef = ref(
      database,
      `hospital/${hospitalID1}/floor/${levelID1}/roomInfo/${roomID1}/pacientInfo/${patientID}/pacientStatus`
    );
    set(patientStatusRef, status);
    setEditingStatus((prevStatus) => ({ ...prevStatus, [patientID]: false }));
  };


  const [hospitalID1, setHospitalID1] = useState(""); // selected hospital ID
  const [levelID1, setLevelID1] = useState(""); // selected level ID
  const [roomID1, setRoomID1] = useState(""); // selected room ID

  // State to manage current page (Hospital, Level, Room)
  const [currentPage, setCurrentPage] = useState("hospitals"); // "hospitals", "hospital", "level", "room"

  // States to handle expansion of hospitals, levels, and rooms
  const [expandedHospitals, setExpandedHospitals] = useState({});
  const [expandedLevels, setExpandedLevels] = useState({});
  const [expandedRooms, setExpandedRooms] = useState({});

  // Fetching data from Firebase Realtime Database
  useEffect(() => {
    const hospitalsRef = ref(database, "hospital");

    const unsubscribe = onValue(hospitalsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const hospitalsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setHospitals(hospitalsArray);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to add a new hospital
  const addHospital = () => {
    const hospitalsRef = ref(database, "hospital");
    const newHospitalRef = push(hospitalsRef);
    set(newHospitalRef, { hospitalName: hospitalName, floor: {} });
    setHospitalName("");
  };

  // Function to add a new level to a hospital
  const addLevel = () => {
    const levelsRef = ref(database, `hospital/${hospitalID1}/floor`);
    const newLevelRef = push(levelsRef);
    set(newLevelRef, { floorNumber: levelName, roomInfo: {} });
    setLevelName("");
  };

  // Function to add a new room to a level
  const addRoom = () => {
    const roomsRef = ref(database, `hospital/${hospitalID1}/floor/${levelID1}/roomInfo`);
    const newRoomRef = push(roomsRef);
    set(newRoomRef, { roomNumber: roomNumber, isOccupied: false, pacientInfo: {} });
    setRoomNumber("");
  };

  // Function to add a new patient to a room
  const addPatient = () => {
    const patientsRef = ref(database, `hospital/${hospitalID1}/floor/${levelID1}/roomInfo/${roomID1}/pacientInfo`);
    const newPatientRef = push(patientsRef);
    set(newPatientRef, { ...patientDetails });
    setPatientDetails({
      pacientName: "",
      pacientAge: "",
      pacientDiagnosis: "",
      doctorName: "",
      pacientStatus: "",
    });
  };

  // Function to delete a hospital
  const deleteHospital = (hospitalID) => {
    const hospitalRef = ref(database, `hospital/${hospitalID}`);
    remove(hospitalRef);
  };

  // Function to delete a level from a hospital
  const deleteLevel = (hospitalID, levelID) => {
    const levelRef = ref(database, `hospital/${hospitalID}/floor/${levelID}`);
    remove(levelRef);
  };
  const navigateToPatient = (hospitalID, levelID, roomID, patientID) => {
    setPatientID1(patientID);
    setCurrentPage("patient");
  };
  // Function to delete a room from a level
  const deleteRoom = (hospitalID, levelID, roomID) => {
    const roomRef = ref(database, `hospital/${hospitalID}/floor/${levelID}/roomInfo/${roomID}`);
    remove(roomRef);
  };

  // Function to delete a patient from a room
  const deletePatient = (hospitalID1, levelID1, roomID1, patientKey) => {
    const patientRef = ref(database, `hospital/${hospitalID1}/floor/${levelID1}/roomInfo/${roomID1}/pacientInfo/${patientKey}`);
    remove(patientRef);
  };

  // Function to toggle the expansion of a hospital
  const toggleHospitalExpansion = (hospitalID) => {
    setExpandedHospitals((prevExpandedHospitals) => ({
      ...prevExpandedHospitals,
      [hospitalID]: !prevExpandedHospitals[hospitalID],
    }));
  };

  // Function to toggle the expansion of a level
  const toggleLevelExpansion = (hospitalID, levelID) => {
    setExpandedLevels((prevExpandedLevels) => ({
      ...prevExpandedLevels,
      [`${hospitalID}_${levelID}`]: !prevExpandedLevels[`${hospitalID}_${levelID}`],
    }));
  };

  // Function to toggle the expansion of a room
  const toggleRoomExpansion = (hospitalID, levelID, roomID) => {
    setExpandedRooms((prevExpandedRooms) => ({
      ...prevExpandedRooms,
      [`${hospitalID}_${levelID}_${roomID}`]: !prevExpandedRooms[`${hospitalID}_${levelID}_${roomID}`],
    }));
  };

  // Function to handle navigation
  const navigateToHospital = (hospitalID) => {
    setHospitalID1(hospitalID);
    setCurrentPage("hospital");
  };

  const navigateToLevel = (hospitalID, levelID) => {
    setLevelID1(levelID);
    setCurrentPage("level");
  };

  const navigateToRoom = (hospitalID, levelID, roomID) => {
    setRoomID1(roomID);
    setCurrentPage("room");
  };

  // Render the current page
  const renderPage = () => {
    switch (currentPage) {
      case "hospitals":
        return (
          <div className="to-the-edge">
            <h1>Hospitals</h1>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="Hospital Name"
            />
            <button onClick={addHospital} className="button-blue">Add Hospital</button>
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="box spital"  onClick={() => navigateToHospital(hospital.id)}>
                <div
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  <h1>Hospital: {hospital.hospitalName}</h1>
                </div>
                </div>
              ))}
            
        </div>
        );
        
      case "hospital":
        const hospital = hospitals.find((h) => h.id === hospitalID1);
        return (
          <div className="to-the-edge">
            <h1>Hospital: {hospital.hospitalName}</h1>
            <div className="nicely-done">
              <button onClick={() => setCurrentPage("hospitals")} className="button-blue">Back to Hospitals</button>
              <button onClick={addLevel} className="button-blue">Add Level</button>
            </div>
            {hospital.floor && (
              <div>
                {Object.keys(hospital.floor).map((levelKey, index) => {
                  const level = hospital.floor[levelKey];
                  return (
                    <div key={levelKey} className="box" 
                    onClick={() => navigateToLevel(hospital.id, levelKey)}
                    >
                      <div
                        
                        style={{ cursor: "pointer", color: "green" }}
                      >
                        <h2>Level {index + 1}</h2>
                      </div>
                      <button onClick={() => deleteLevel(hospital.id, levelKey)} className="button-of-delete">
                        Delete Level
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      
      case "level":
        const level = hospitals.find((h) => h.id === hospitalID1)?.floor[levelID1];
        return (
          <div className="to-the-edge">
            <h1>Level: {level.floorNumber}</h1>
            <div className="nicely-done">
              <button onClick={() => setCurrentPage("hospital")} className="button-blue">Back to Hospital</button>
              <button onClick={addRoom} className="button-blue">Add Room</button>
            </div>
            {level.roomInfo && (
              <div>
                {Object.keys(level.roomInfo).map((roomKey, index) => {
                  const room = level.roomInfo[roomKey];
                  return (
                    <div key={roomKey} className="box"
                      onClick={() => navigateToRoom(hospitalID1, levelID1, roomKey)}
                    >
                      <div
                        style={{ cursor: "pointer", color: "blue" }}
                      >
                        <h2>Room {index + 1}</h2>
                      </div>
                      <button onClick={() => deleteRoom(hospitalID1, levelID1, roomKey)} className="button-blue"
                      >
                        Delete Room
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      case "room":
        const room = hospitals
          .find((h) => h.id === hospitalID1)
          ?.floor[levelID1]
          ?.roomInfo[roomID1];
        return (
          <div>
            <h1>Room: {room.roomNumber}</h1>
            <button onClick={() => setCurrentPage("level")}
              className="button-blue"

              >Back to Level</button>
            <h2 className="title">Add New Patient</h2>
            <div className="addPatient">
            <input
              type="text"
              value={patientDetails.pacientName}
              onChange={(e) => setPatientDetails({ ...patientDetails, pacientName: e.target.value })}
              placeholder="Patient Name"
            />
            <input
              type="text"
              value={patientDetails.pacientAge}
              onChange={(e) => setPatientDetails({ ...patientDetails, pacientAge: e.target.value })}
              placeholder="Patient Age"
            />
            <input
              type="text"
              value={patientDetails.pacientDiagnosis}
              onChange={(e) => setPatientDetails({ ...patientDetails, pacientDiagnosis: e.target.value })}
              placeholder="Diagnosis"
            />
            <input
              type="text"
              value={patientDetails.doctorName}
              onChange={(e) => setPatientDetails({ ...patientDetails, doctorName: e.target.value })}
              placeholder="Doctor Name"
            />
            <input
              type="text"
              value={patientDetails.pacientStatus}
              onChange={(e) => setPatientDetails({ ...patientDetails, pacientStatus: e.target.value })}
              placeholder="Status"
            />
            </div>
            <button onClick={addPatient}
            className="button-blue"
            >Add Patient</button>

            {room.pacientInfo && (
              <div className="patients">
                <h2 className="title">Patients</h2>
                {Object.keys(room.pacientInfo).map((patientKey) => {
                  const patient = room.pacientInfo[patientKey];
                  return (
                    <div key={patientKey} className="box"
                    onClick={() => navigateToPatient(hospitalID1, levelID1, roomID1, patientKey)}
                    >
                      <h3
                        style={{ cursor: "pointer", color: "blue" }}
                      >
                        Patient: {patient.pacientName}
                      </h3>
                      <button onClick={() => deletePatient(hospitalID1, levelID1, roomID1, patientKey)} style={{ color: "red" }}>
                        Delete Patient
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      case "patient":
        const patient = hospitals
          .find((h) => h.id === hospitalID1)
          ?.floor[levelID1]
          ?.roomInfo[roomID1]
          ?.pacientInfo[patientID1];
        return (
          <div style={{marginTop:'75px'}}>
             <button onClick={() => setCurrentPage("room")}>Back to Room</button>
            <h1 className="title">Patient: {patient.pacientName}</h1>
            <p>Age: {patient.pacientAge}</p>
            <p>Diagnosis: {patient.pacientDiagnosis}</p>
            <p>Doctor: {patient.doctorName}</p>
            <p>Status: {patient.pacientStatus}</p>
            <button
              onClick={() => setEditingStatus((prevStatus) => ({ ...prevStatus, [patientID1]: true }))}
               className="button-blue"
            >
              Edit Status
            </button>
            {editingStatus[patientID1] && (
              <div>
                <input
                  type="text"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  placeholder="Enter new status"
                />
                <button 
                onClick={() => updatePatientStatus(patientID1, newStatus)} 
                className="button-blue">
                  Save Status
                </button>
              </div>
            )}
            <div>
            <TaskManager
                      hospitalID={hospitalID1}
                      levelID={levelID1}
                      roomID={roomID1}
                      patientID={patientID1} // Pass patient ID to TaskManager
                    />
                </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="boxboxCartaj">{renderPage()}</div>;
}

export default HospitalData;
