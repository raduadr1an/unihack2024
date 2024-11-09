import React, { useEffect, useState } from "react";
import { ref, onValue, set, push, remove, update } from "firebase/database";
import { database } from "../../firebaseConfig";
import "./HospitalData.css";
import TaskManager from './TaskManager';

function HospitalData() {
  const [hospitals, setHospitals] = useState([]);
  const [hospitalName, setHospitalName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [patientDetails, setPatientDetails] = useState({
    pacientName: "",
    pacientAge: "",
    pacientDiagnosis: "",
    doctorName: "",
    pacientStatus: "",
  });

  const [hospitalID1, setHospitalID1] = useState("");
  const [levelID1, setLevelID1] = useState("");
  const [roomID1, setRoomID1] = useState("");
  const [patientID1, setPatientID1] = useState("");

  const [currentPage, setCurrentPage] = useState("hospitals");

  const [expandedHospitals, setExpandedHospitals] = useState({});
  const [expandedLevels, setExpandedLevels] = useState({});
  const [expandedRooms, setExpandedRooms] = useState({});

  const [editingStatus, setEditingStatus] = useState({});
  const [newStatus, setNewStatus] = useState("");
  const [tasks, setTasks] = useState([]); // Holds tasks for the selected hospital
  const [newTask, setNewTask] = useState(""); // Holds input for the new task
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
    const levelIndex = Object.keys(hospitals.find(h => h.id === hospitalID1)?.floor || {}).length + 1;
    const newLevelRef = push(levelsRef);
    set(newLevelRef, { floorNumber: `Level ${levelIndex}`, roomInfo: {} });
  };

  const addRoom = () => {
    const roomsRef = ref(database, `hospital/${hospitalID1}/floor/${levelID1}/roomInfo`);
    const roomIndex = Object.keys(
      hospitals.find((h) => h.id === hospitalID1)?.floor[levelID1]?.roomInfo || {}
    ).length + 1;
    const newRoomRef = push(roomsRef);
    set(newRoomRef, { roomNumber: `Room ${roomIndex}`, isOccupied: false, pacientInfo: {} });
    setRoomNumber("");
  };

  const addPatient = () => {
    const patientsRef = ref(
      database,
      `hospital/${hospitalID1}/floor/${levelID1}/roomInfo/${roomID1}/pacientInfo`
    );
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

  const updatePatientStatus = async (patientKey, newStatus) => {
    try {
      const patientRef = ref(
        database,
        `hospital/${hospitalID1}/floor/${levelID1}/roomInfo/${roomID1}/pacientInfo/${patientKey}`
      );

      await update(patientRef, { pacientStatus: newStatus });

      setEditingStatus((prevStatus) => ({ ...prevStatus, [patientKey]: false }));
    } catch (error) {
      console.error("Error updating patient status:", error);
      alert("An error occurred while updating the patient status.");
    }
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
    const patientRef = ref(
      database,
      `hospital/${hospitalID1}/floor/${levelID1}/roomInfo/${roomID1}/pacientInfo/${patientKey}`
    );
    remove(patientRef);
  };

  const toggleHospitalExpansion = (hospitalID) => {
    setExpandedHospitals((prevExpandedHospitals) => ({
      ...prevExpandedHospitals,
      [hospitalID]: !prevExpandedHospitals[hospitalID],
    }));
  };

  const toggleLevelExpansion = (hospitalID, levelID) => {
    setExpandedLevels((prevExpandedLevels) => ({
      ...prevExpandedLevels,
      [`${hospitalID}_${levelID}`]: !prevExpandedLevels[`${hospitalID}_${levelID}`],
    }));
  };

  const toggleRoomExpansion = (hospitalID, levelID, roomID) => {
    setExpandedRooms((prevExpandedRooms) => ({
      ...prevExpandedRooms,
      [`${hospitalID}_${levelID}_${roomID}`]: !prevExpandedRooms[`${hospitalID}_${levelID}_${roomID}`],
    }));
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
          <div>
            <h1>Hospitals</h1>
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
            <button onClick={addLevel}>Add Level</button>
            {hospital.floor && (
              <div>
                {Object.keys(hospital.floor).map((levelKey, index) => {
                  const level = hospital.floor[levelKey];
                  return (
                    <div key={levelKey} className="box">
                      <div
                        onClick={() => navigateToLevel(hospital.id, levelKey)}
                        style={{ cursor: "pointer", color: "green" }}
                      >
                        <h2>Level {index + 1}</h2>
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
        const level = hospitals.find((h) => h.id === hospitalID1)?.floor[levelID1];
        return (
          <div>
            <h1>Level: {level.floorNumber}</h1>
            <button onClick={() => setCurrentPage("hospital")}>Back to Hospital</button>
            <button onClick={addRoom}>Add Room</button>
            {level.roomInfo && (
              <div>
                {Object.keys(level.roomInfo).map((roomKey, index) => {
                  const room = level.roomInfo[roomKey];
                  return (
                    <div key={roomKey} className="box">
                      <div
                        onClick={() => navigateToRoom(hospitalID1, levelID1, roomKey)}
                        style={{ cursor: "pointer", color: "blue" }}
                      >
                        <h2>Room {index + 1}</h2>
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
            <button onClick={addPatient}>Add Patient</button>

            {room.pacientInfo && (
              <div className="patients">
                <h2 className="title">Patients</h2>
                {Object.keys(room.pacientInfo).map((patientKey) => {
                  const patient = room.pacientInfo[patientKey];
                  return (
                    <div key={patientKey} className="box">
                      <h3
                        onClick={() => navigateToPatient(hospitalID1, levelID1, roomID1, patientKey)}
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
              style={{ color: "orange" }}
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
                <button onClick={() => updatePatientStatus(patientID1, newStatus)} style={{ color: "green" }}>
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

  return <div className="container">{renderPage()}</div>;
}

export default HospitalData;
