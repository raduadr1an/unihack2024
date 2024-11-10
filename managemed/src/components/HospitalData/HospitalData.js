import React, { useEffect, useState } from "react";
import { ref, onValue, set, push, remove } from "firebase/database";
import { database } from '../../firebaseConfig';
import "./HospitalData.css";
import TaskManager from "./TaskManager";

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
  const [patientID1, setPatientID1] = useState("");
  const [editingStatus, setEditingStatus] = useState({});
  const [newStatus, setNewStatus] = useState("");
  const [hospitalID1, setHospitalID1] = useState("");
  const [levelID1, setLevelID1] = useState("");
  const [roomID1, setRoomID1] = useState("");
  const [currentPage, setCurrentPage] = useState("hospitals");
  const [expandedHospitals, setExpandedHospitals] = useState({});
  const [expandedLevels, setExpandedLevels] = useState({});
  const [expandedRooms, setExpandedRooms] = useState({});

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
      } else {
        setHospitals([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const updatePatientStatus = (patientID, status) => {
    try {
      const patientStatusRef = ref(
        database,
        `hospital/${hospitalID1}/floor/${levelID1}/roomInfo/${roomID1}/pacientInfo/${patientID}/pacientStatus`
      );
      set(patientStatusRef, status);
      setEditingStatus((prevStatus) => ({ ...prevStatus, [patientID]: false }));
      setNewStatus("");
    } catch (error) {
      console.error("Error updating patient status:", error);
      alert("Failed to update patient status. Please try again.");
    }
  };

  const addHospital = () => {
    if (!hospitalName.trim()) return;
    try {
      const hospitalsRef = ref(database, "hospital");
      const newHospitalRef = push(hospitalsRef);
      set(newHospitalRef, { hospitalName: hospitalName, floor: {} });
      setHospitalName("");
    } catch (error) {
      console.error("Error adding hospital:", error);
      alert("Failed to add hospital. Please try again.");
    }
  };

  const addLevel = () => {
    if (!levelName.trim()) return;
    try {
      const levelsRef = ref(database, `hospital/${hospitalID1}/floor`);
      const newLevelRef = push(levelsRef);
      set(newLevelRef, { floorNumber: levelName, roomInfo: {} });
      setLevelName("");
    } catch (error) {
      console.error("Error adding level:", error);
      alert("Failed to add level. Please try again.");
    }
  };

  const addRoom = () => {
    if (!roomNumber.trim()) return;
    try {
      const roomsRef = ref(database, `hospital/${hospitalID1}/floor/${levelID1}/roomInfo`);
      const newRoomRef = push(roomsRef);
      set(newRoomRef, { roomNumber: roomNumber, isOccupied: false, pacientInfo: {} });
      setRoomNumber("");
    } catch (error) {
      console.error("Error adding room:", error);
      alert("Failed to add room. Please try again.");
    }
  };

  const addPatient = () => {
    if (!patientDetails.pacientName.trim()) return;
    try {
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
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to add patient. Please try again.");
    }
  };

  const deleteHospital = (e, hospitalID) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this hospital?')) {
      try {
        const hospitalRef = ref(database, `hospital/${hospitalID}`);
        remove(hospitalRef);
        if (hospitalID === hospitalID1) {
          setCurrentPage("hospitals");
        }
      } catch (error) {
        console.error("Error deleting hospital:", error);
        alert("Failed to delete hospital. Please try again.");
      }
    }
  };

  const deleteLevel = (e, hospitalID, levelID) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this level?')) {
      try {
        const levelRef = ref(database, `hospital/${hospitalID}/floor/${levelID}`);
        remove(levelRef);
        if (currentPage === "level" && levelID === levelID1) {
          setCurrentPage("hospital");
        }
      } catch (error) {
        console.error("Error deleting level:", error);
        alert("Failed to delete level. Please try again.");
      }
    }
  };

  const deleteRoom = (e, hospitalID, levelID, roomID) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const roomRef = ref(database, `hospital/${hospitalID}/floor/${levelID}/roomInfo/${roomID}`);
        remove(roomRef);
        if (currentPage === "room" && roomID === roomID1) {
          setCurrentPage("level");
        }
      } catch (error) {
        console.error("Error deleting room:", error);
        alert("Failed to delete room. Please try again.");
      }
    }
  };

  const deletePatient = (e, hospitalID, levelID, roomID, patientKey) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        const patientRef = ref(database, `hospital/${hospitalID}/floor/${levelID}/roomInfo/${roomID}/pacientInfo/${patientKey}`);
        remove(patientRef);
        if (currentPage === "patient" && patientKey === patientID1) {
          setCurrentPage("room");
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Failed to delete patient. Please try again.");
      }
    }
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

  const navigateToPatient = (hospitalID, levelID, roomID, patientID) => {
    setPatientID1(patientID);
    setCurrentPage("patient");
  };

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
              className="input-field"
            />
            <button 
              onClick={addHospital}
              className="button-blue"
              disabled={!hospitalName.trim()}
            >
              Add Hospital
            </button>
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="box" onClick={() => navigateToHospital(hospital.id)}>
                <div style={{ cursor: "pointer", color: "blue" }}>
                  <h1>Hospital: {hospital.hospitalName}</h1>
                </div>
                <button 
                  onClick={(e) => deleteHospital(e, hospital.id)} 
                  className="button-of-delete"
                >
                  Delete Hospital
                </button>
              </div>
            ))}
          </div>
        );

      case "hospital":
        const hospital = hospitals.find((h) => h.id === hospitalID1);
        if (!hospital) {
          setCurrentPage("hospitals");
          return null;
        }
        return (
          <div className="to-the-edge">
            <h1>Hospital: {hospital.hospitalName}</h1>
            <div className="nicely-done">
              <button onClick={() => setCurrentPage("hospitals")} className="button-blue">
                Back to Hospitals
              </button>
              <input
                type="text"
                value={levelName}
                onChange={(e) => setLevelName(e.target.value)}
                placeholder="Floor Name"
                className="input-field"
              />
              <button 
                onClick={addLevel} 
                className="button-blue"
                disabled={!levelName.trim()}
              >
                Add Floor
              </button>
            </div>
            {hospital.floor && (
              <div>
                {Object.keys(hospital.floor).map((levelKey, index) => {
                  const level = hospital.floor[levelKey];
                  return (
                    <div key={levelKey} className="box" onClick={() => navigateToLevel(hospital.id, levelKey)}>
                      <div style={{ cursor: "pointer", color: "green" }}>
                        <h2>{level.floorNumber}</h2>
                      </div>
                      <button 
                        onClick={(e) => deleteLevel(e, hospital.id, levelKey)} 
                        className="button-of-delete"
                      >
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
        if (!level) {
          setCurrentPage("hospital");
          return null;
        }
        return (
          <div className="to-the-edge">
            <h1>{level.floorNumber}</h1>
            <div className="nicely-done">
              <button onClick={() => setCurrentPage("hospital")} className="button-blue">
                Back to Hospital
              </button>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Room Number"
                className="input-field"
              />
              <button 
                onClick={addRoom} 
                className="button-blue"
                disabled={!roomNumber.trim()}
              >
                Add Room
              </button>
            </div>
            {level.roomInfo && (
              <div>
                {Object.keys(level.roomInfo).map((roomKey, index) => {
                  const room = level.roomInfo[roomKey];
                  return (
                    <div key={roomKey} className="box" onClick={() => navigateToRoom(hospitalID1, levelID1, roomKey)}>
                      <div style={{ cursor: "pointer", color: "blue" }}>
                        <h2>Room {room.roomNumber || index + 1}</h2>
                      </div>
                      <button 
                        onClick={(e) => deleteRoom(e, hospitalID1, levelID1, roomKey)} 
                        className="button-of-delete"
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
        const room = hospitals.find((h) => h.id === hospitalID1)?.floor[levelID1]?.roomInfo[roomID1];
        if (!room) {
          setCurrentPage("level");
          return null;
        }
        return (
          <div className="to-the-edge">
            <h1>Room {room.roomNumber}</h1>
            <button onClick={() => setCurrentPage("level")} className="button-blue">
              Back to Level
            </button>

            {room.pacientInfo && (
              <div className="patients">
                <h2 className="title">Patients</h2>
                {Object.keys(room.pacientInfo).map((patientKey) => {
                  const patient = room.pacientInfo[patientKey];
                  return (
                    <div key={patientKey} className="box" onClick={() => navigateToPatient(hospitalID1, levelID1, roomID1, patientKey)}>
                      <div style={{ cursor: "pointer", color: "blue" }}>
                        <h3>Patient: {patient.pacientName}</h3>
                        <p>Status: {patient.pacientStatus}</p>
                      </div>
		      <button
			onClick={(e) => deletePatient(e, hospitalID1, levelID1, roomID1, patientKey)} 
                        className="button-of-delete"
                      >
                        Delete Patient
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
	
            <h2 className="title">Add New Patient</h2>
            <div className="addPatient">
              <input
                type="text"
                value={patientDetails.pacientName}
                onChange={(e) => setPatientDetails({ ...patientDetails, pacientName: e.target.value })}
                placeholder="Patient Name"
                className="input-field"
              />
              <input
                type="text"
                value={patientDetails.pacientAge}
                onChange={(e) => setPatientDetails({ ...patientDetails, pacientAge: e.target.value })}
                placeholder="Patient Age"
                className="input-field"
              />
              <input
                type="text"
                value={patientDetails.pacientDiagnosis}
                onChange={(e) => setPatientDetails({ ...patientDetails, pacientDiagnosis: e.target.value })}
                placeholder="Diagnosis"
                className="input-field"
              />
              <input
                type="text"
                value={patientDetails.doctorName}
                onChange={(e) => setPatientDetails({ ...patientDetails, doctorName: e.target.value })}
                placeholder="Doctor Name"
                className="input-field"
              />
              <input
                type="text"
                value={patientDetails.pacientStatus}
                onChange={(e) => setPatientDetails({ ...patientDetails, pacientStatus: e.target.value })}
                placeholder="Status"
                className="input-field"
              />
            </div>
            <button 
              onClick={addPatient}
              className="button-blue"
              disabled={!patientDetails.pacientName.trim()}
            >
              Add Patient
            </button>
          </div>
        );

      case "patient":
        const patient = hospitals
          .find((h) => h.id === hospitalID1)
          ?.floor[levelID1]
          ?.roomInfo[roomID1]
          ?.pacientInfo[patientID1];
        
        if (!patient) {
          setCurrentPage("room");
          return null;
        }

        return (
          <div className="to-the-edge" style={{marginTop:'75px'}}>
            <button onClick={() => setCurrentPage("room")} className="button-blue">
              Back to Room
            </button>
            <h1 className="title">Patient Name: <strong>{patient.pacientName}</strong></h1>
            <div className="patient-details">
              <p><strong>Age:</strong> {patient.pacientAge}</p>
              <p><strong>Diagnosis:</strong> {patient.pacientDiagnosis}</p>
              <p><strong>Doctor:</strong> {patient.doctorName}</p>
              <p><strong>Status:</strong> {patient.pacientStatus}</p>
            </div>
            <button
              onClick={() => setEditingStatus((prevStatus) => ({ ...prevStatus, [patientID1]: true }))}
              className="button-blue"
            >
              Edit Status
            </button>
            
            {editingStatus[patientID1] && (
              <div className="status-edit">
                <input
                  type="text"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  placeholder="Enter new status"
                  className="input-field"
                />
                <button 
                  onClick={() => updatePatientStatus(patientID1, newStatus)} 
                  className="button-blue"
                  disabled={!newStatus.trim()}
                >
                  Save Status
                </button>
                <button 
                  onClick={() => {
                    setEditingStatus((prevStatus) => ({ ...prevStatus, [patientID1]: false }));
                    setNewStatus("");
                  }} 
                  className="button-of-delete"
                >
                  Cancel
                </button>
              </div>
            )}
            
            <div className="task-manager-container">
              <TaskManager
                hospitalID={hospitalID1}
                levelID={levelID1}
                roomID={roomID1}
                patientID={patientID1}
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

