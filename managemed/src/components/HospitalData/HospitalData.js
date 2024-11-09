import React, { useEffect, useState } from "react";
import { ref, onValue, set, push, remove } from "firebase/database";
import {database} from '../../firebaseConfig';
import "./HospitalData.css";

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
          <div>
            <h1>Hospitals</h1>
            <h2>Add New Hospital</h2>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="Hospital Name"
            />
            <button onClick={addHospital}>Add Hospital</button>
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="box">
                <div
                  onClick={() => navigateToHospital(hospital.id)}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  <h1>Hospital: {hospital.hospitalName}</h1>
                </div>
                <button onClick={() => deleteHospital(hospital.id)} style={{ color: "red" }}>
                  Delete Hospital
                </button>
              </div>
            ))}
            
          </div>
        );
      case "hospital":
        const hospital = hospitals.find((h) => h.id === hospitalID1);
        return (
          <div>
            <h1>Hospital: {hospital.hospitalName}</h1>
            <button onClick={() => setCurrentPage("hospitals")}>Back to Hospitals</button>
            <h2>Add New Level</h2>
            <input
              type="text"
              value={levelName}
              onChange={(e) => setLevelName(e.target.value)}
              placeholder="Level Name"
            />
            <button onClick={addLevel}>Add Level</button>
            {hospital.floor && (
              <div>
                <h2>Levels</h2>
                {Object.keys(hospital.floor).map((levelKey) => {
                  const level = hospital.floor[levelKey];
                  return (
                    <div key={levelKey} className="box">
                      <div
                        onClick={() => navigateToLevel(hospital.id, levelKey)}
                        style={{ cursor: "pointer", color: "green" }}
                      >
                        <h2>Level: {level.floorNumber}</h2>
                      </div>
                      <button onClick={() => deleteLevel(hospital.id, levelKey)} style={{ color: "red" }}>
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
        const level = hospitals
          .find((h) => h.id === hospitalID1)
          ?.floor[levelID1];
        return (
          <div>
            <h1>Level: {level.floorNumber}</h1>
            <button onClick={() => setCurrentPage("hospital")}>Back to Hospital</button>
            <h2>Add New Room</h2>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="Room Number"
            />
            <button onClick={addRoom}>Add Room</button>
            {level.roomInfo && (
              <div>
                <h2>Rooms</h2>
                {Object.keys(level.roomInfo).map((roomKey) => {
                  const room = level.roomInfo[roomKey];
                  return (
                    <div key={roomKey} className="box">
                      <div
                        onClick={() => navigateToRoom(hospitalID1, levelID1, roomKey)}
                        style={{ cursor: "pointer", color: "purple" }}
                      >
                        <h3>Room: {room.roomNumber}</h3>
                      </div>
                      <button onClick={() => deleteRoom(hospitalID1, levelID1, roomKey)} style={{ color: "red" }}>
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
            <button onClick={() => setCurrentPage("level")}>Back to Level</button>
            <h2>Add New Patient</h2>
            <input
              type="text"
              value={patientDetails.pacientName}
              onChange={(e) =>
                setPatientDetails({ ...patientDetails, pacientName: e.target.value })
              }
              placeholder="Patient Name"
            />
            <input
              type="text"
              value={patientDetails.pacientAge}
              onChange={(e) =>
                setPatientDetails({ ...patientDetails, pacientAge: e.target.value })
              }
              placeholder="Age"
            />
            <input
              type="text"
              value={patientDetails.pacientDiagnosis}
              onChange={(e) =>
                setPatientDetails({ ...patientDetails, pacientDiagnosis: e.target.value })
              }
              placeholder="Diagnosis"
            />
            <input
              type="text"
              value={patientDetails.doctorName}
              onChange={(e) =>
                setPatientDetails({ ...patientDetails, doctorName: e.target.value })
              }
              placeholder="Doctor Name"
            />
            <input
              type="text"
              value={patientDetails.pacientStatus}
              onChange={(e) =>
                setPatientDetails({ ...patientDetails, pacientStatus: e.target.value })
              }
              placeholder="Status"
            />
            <button onClick={addPatient}>Add Patient</button>
            {room.pacientInfo && (
              <div>
                <h2>Patients</h2>
                {Object.keys(room.pacientInfo).map((patientKey) => {
                  const patient = room.pacientInfo[patientKey];
                  return (
                    <div key={patientKey} className="box">
                      <h3>Patient: {patient.pacientName}</h3>
                      <p>Age: {patient.pacientAge}</p>
                      <p>Diagnosis: {patient.pacientDiagnosis}</p>
                      <p>Doctor: {patient.doctorName}</p>
                      <p>Status: {patient.pacientStatus}</p>
                      <button
                        onClick={() => deletePatient(hospitalID1, levelID1, roomID1, patientKey)}
                        style={{ color: "red" }}
                      >
                        Delete Patient
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderPage()}
    </div>
  );
}

export default HospitalData;
