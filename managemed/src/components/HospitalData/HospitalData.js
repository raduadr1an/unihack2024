import React, { useEffect, useState } from "react";
import { ref, onValue, set, push, remove } from "firebase/database";
import {database} from '../../firebaseConfig';
import "./HospitalData.css";

function HospitalData() {
  const [hospitals, setHospitals] = useState([]);
  const [hospitalName, setHospitalName] = useState(""); 
  const [levelName, setLevelName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [patientDetails, setPatientDetails] = useState({
    pacientName: "",
    pacientAge: "",
    pacientDiagnosis: "",
    doctorName: "",
    pacientStatus: ""
  });

  const [hospitalID1, setHospitalID1] = useState(""); 
  const [levelID1, setLevelID1] = useState(""); 
  const [roomID1, setRoomID1] = useState("");

  const [currentPage, setCurrentPage] = useState("hospitals");

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

  const addHospital = () => {
    const hospitalsRef = ref(database, "hospital");
    const newHospitalRef = push(hospitalsRef);
    set(newHospitalRef, { hospitalName: hospitalName, floor: {} });
    setHospitalName("");
  };

  const addLevel = () => {
    const levelsRef = ref(database, `hospital/${hospitalID1}/floor`);
    const newLevelRef = push(levelsRef);
    set(newLevelRef, { floorNumber: levelName, roomInfo: {} });
    setLevelName("");
  };

  const addRoom = () => {
    const roomsRef = ref(database, `hospital/${hospitalID1}/floor/${levelID1}/roomInfo`);
    const newRoomRef = push(roomsRef);
    set(newRoomRef, { roomNumber: roomNumber, isOccupied: false, pacientInfo: {} });
    setRoomNumber("");
  };

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

  const deleteHospital = (hospitalID) => {
    const hospitalRef = ref(database, `hospital/${hospitalID}`);
    remove(hospitalRef);
  };

  const deleteLevel = (hospitalID, levelID) => {
    const levelRef = ref(database, `hospital/${hospitalID}/floor/${levelID}`);
    remove(levelRef);
  };

  const deleteRoom = (hospitalID, levelID, roomID) => {
    const roomRef = ref(database, `hospital/${hospitalID}/floor/${levelID}/roomInfo/${roomID}`);
    remove(roomRef);
  };

  const deletePatient = (hospitalID1, levelID1, roomID1, patientKey) => {
    const patientRef = ref(database, `hospital/${hospitalID1}/floor/${levelID1}/roomInfo/${roomID1}/pacientInfo/${patientKey}`);
    remove(patientRef);
  };

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

  const renderPage = () => {
    switch (currentPage) {
      case "hospitals":
        return (
          <div className="container">
            <h1>Hospitals</h1>
            <div className="add-section">
              <h2>Add New Hospital</h2>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="Hospital Name"
              />
              <button onClick={addHospital}>Add Hospital</button>
            </div>
            <div className="list">
              {hospitals.map((hospital) => (
                <div key={hospital.id} className="box hospital">
                  <h2 onClick={() => navigateToHospital(hospital.id)}>{hospital.hospitalName}</h2>
                  <button onClick={() => deleteHospital(hospital.id)} className="delete-btn">Delete</button>
                </div>
              ))}
            </div>
          </div>
        );
        
      case "hospital":
        const hospital = hospitals.find((h) => h.id === hospitalID1);
        return (
          <div className="container">
            <h1>{hospital.hospitalName}</h1>
            <button onClick={() => setCurrentPage("hospitals")}>Back to Hospitals</button>
            <div className="add-section">
              <h2>Add New Level</h2>
              <input
                type="text"
                value={levelName}
                onChange={(e) => setLevelName(e.target.value)}
                placeholder="Level Name"
              />
              <button onClick={addLevel}>Add Level</button>
            </div>
            <div className="list">
              {hospital.floor && Object.keys(hospital.floor).map((levelKey) => (
                <div key={levelKey} className="box level">
                  <h2 onClick={() => navigateToLevel(hospital.id, levelKey)}>{hospital.floor[levelKey].floorNumber}</h2>
                  <button onClick={() => deleteLevel(hospital.id, levelKey)} className="delete-btn">Delete</button>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "level":
        const level = hospitals.find((h) => h.id === hospitalID1)?.floor[levelID1];
        return (
          <div className="container">
            <h1>{level.floorNumber}</h1>
            <button onClick={() => setCurrentPage("hospital")}>Back to Hospital</button>
            <div className="add-section">
              <h2>Add New Room</h2>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Room Number"
              />
              <button onClick={addRoom}>Add Room</button>
            </div>
            <div className="list">
              {level.roomInfo && Object.keys(level.roomInfo).map((roomKey) => (
                <div key={roomKey} className="box room">
                  <h3 onClick={() => navigateToRoom(hospitalID1, levelID1, roomKey)}>{level.roomInfo[roomKey].roomNumber}</h3>
                  <button onClick={() => deleteRoom(hospitalID1, levelID1, roomKey)} className="delete-btn">Delete</button>
                </div>
              ))}
            </div>
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
              <h2 className="title">Add New Patient</h2>
              <div className="addPatient">
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
                  type="text" className="felex"
                  value={patientDetails.pacientStatus}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, pacientStatus: e.target.value })
                  }
                  placeholder="Status"
                />
              </div>
              
              <button onClick={addPatient}>Add Patient</button>
              {room.pacientInfo && (
                <div className="patients">
                  <h2 className="title">Patients</h2>
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
