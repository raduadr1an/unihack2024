import React, { useEffect, useState } from "react";
import { ref, onValue, set, push, remove } from "firebase/database";
import database from "../firebaseConfig";
import "./HospitalData.css"; // Assuming CSS is handled for layout

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
  const addHospital = (hospitalName) => {
    const hospitalsRef = ref(database, "hospital");
    const newHospitalRef = push(hospitalsRef);
    set(newHospitalRef, { hospitalName: hospitalName, floor: {} });
    setHospitalName("");
  };

  // Function to add a new level to a hospital
  const addLevel = (hospitalID1, levelName) => {
    const levelsRef = ref(database, `hospital/${hospitalID1}/floor`);
    const newLevelRef = push(levelsRef);
    set(newLevelRef, { floorNumber: levelName, roomInfo: {} });
    setLevelName("");
  };

  // Function to add a new room to a level
  const addRoom = (hospitalID1, levelID1, roomNumber) => {
    const roomsRef = ref(database, `hospital/${hospitalID1}/floor/${levelID1}/roomInfo`);
    const newRoomRef = push(roomsRef);
    set(newRoomRef, { roomNumber: roomNumber, isOccupied: false, pacientInfo: {} });
    setRoomNumber("");
  };

  // Function to add a new patient to a room
  const addPatient = (hospitalID1, levelID1, roomID1, patientDetails) => {
    const patientsRef = ref(database, `hospital/${hospitalID1}/floor/${levelID1}/roomInfo/${roomID1}/pacientInfo`);
    const newPatientRef = push(patientsRef);
    set(newPatientRef, { ...patientDetails });
    setPatientDetails({ pacientName: "", pacientAge: "", pacientDiagnosis: "", doctorName: "", pacientStatus: "" });
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

  return (
    <div className="container">
      <div className="hospital-data-box">
        <h1>Hospitals</h1>
        {hospitals.map((hospital) => (
          <div key={hospital.id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
            <h2>Hospital: {hospital.hospitalName}</h2>
            <button onClick={() => deleteHospital(hospital.id)} style={{ color: "red" }}>
              Delete Hospital
            </button>
            {hospital.floor && (
              <div style={{ marginLeft: "20px" }}>
                <h3>Levels</h3>
                {Object.keys(hospital.floor).map((levelKey) => {
                  const level = hospital.floor[levelKey];
                  return (
                    <div key={levelKey} style={{ marginBottom: "10px" }}>
                      <h4>Level: {level.floorNumber}</h4>
                      <button onClick={() => deleteLevel(hospital.id, levelKey)} style={{ color: "red" }}>
                        Delete Level
                      </button>
                      {level.roomInfo && (
                        <div style={{ marginLeft: "20px" }}>
                          <h5>Rooms</h5>
                          {Object.keys(level.roomInfo).map((roomKey) => {
                            const room = level.roomInfo[roomKey];
                            return (
                              <div key={roomKey} style={{ marginBottom: "10px" }}>
                                <h6>Room {room.roomNumber}</h6>
                                <button onClick={() => deleteRoom(hospital.id, levelKey, roomKey)} style={{ color: "red" }}>
                                  Delete Room
                                </button>
                                {room.pacientInfo && (
                                  <div style={{ marginLeft: "20px" }}>
                                    <h6>Patients</h6>
                                    {Object.keys(room.pacientInfo).map((patientKey) => {
                                      const patient = room.pacientInfo[patientKey];
                                      return (
                                        <div key={patientKey} style={{ marginBottom: "5px", paddingLeft: "10px", borderLeft: "2px solid #ddd" }}>
                                          <p><strong>Name:</strong> {patient.pacientName}</p>
                                          <p><strong>Age:</strong> {patient.pacientAge}</p>
                                          <p><strong>Diagnosis:</strong> {patient.pacientDiagnosis}</p>
                                          <p><strong>Doctor:</strong> {patient.doctorName}</p>
                                          <p><strong>Status:</strong> {patient.pacientStatus}</p>
                                          <button onClick={() => deletePatient(hospital.id, levelKey, roomKey, patientKey)} style={{ color: "red" }}>
                                            Delete Patient
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="add-elements-box">
        {/* Form to add a new hospital */}
        <div>
          <h3>Add New Hospital</h3>
          <input
            type="text"
            placeholder="Hospital Name"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
          />
          <button onClick={() => addHospital(hospitalName)}>Add Hospital</button>
        </div>

        {/* Form to add a new level */}
        <div>
          <h3>Add New Level</h3>
          <select onChange={(e) => setHospitalID1(e.target.value)}>
            <option value="">Select Hospital</option>
            {hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.hospitalName}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Level Name"
            value={levelName}
            onChange={(e) => setLevelName(e.target.value)}
          />
          <button onClick={() => addLevel(hospitalID1, levelName)}>Add Level</button>
        </div>

        {/* Form to add a new room */}
        <div>
          <h3>Add New Room</h3>
          <select onChange={(e) => setLevelID1(e.target.value)}>
            <option value="">Select Level</option>
            {hospitalID1 &&
              hospitals
                .find((h) => h.id === hospitalID1)
                ?.floor && 
              Object.keys(hospitals.find((h) => h.id === hospitalID1).floor).map((levelKey) => (
                <option key={levelKey} value={levelKey}>
                  {hospitals.find((h) => h.id === hospitalID1).floor[levelKey].floorNumber}
                </option>
              ))}
          </select>
          <input
            type="text"
            placeholder="Room Number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
          <button onClick={() => addRoom(hospitalID1, levelID1, roomNumber)}>Add Room</button>
        </div>

        {/* Form to add a new patient */}
        <div>
          <h3>Add New Patient</h3>
          <select onChange={(e) => setRoomID1(e.target.value)}>
            <option value="">Select Room</option>
            {hospitalID1 && levelID1 && hospitals
              .find((h) => h.id === hospitalID1)
              ?.floor[levelID1]?.roomInfo &&
              Object.keys(hospitals.find((h) => h.id === hospitalID1).floor[levelID1].roomInfo).map((roomKey) => (
                <option key={roomKey} value={roomKey}>
                  {hospitals.find((h) => h.id === hospitalID1).floor[levelID1].roomInfo[roomKey].roomNumber}
                </option>
              ))}
          </select>
          <input
            type="text"
            placeholder="Patient Name"
            value={patientDetails.pacientName}
            onChange={(e) => setPatientDetails({ ...patientDetails, pacientName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Patient Age"
            value={patientDetails.pacientAge}
            onChange={(e) => setPatientDetails({ ...patientDetails, pacientAge: e.target.value })}
          />
          <input
            type="text"
            placeholder="Diagnosis"
            value={patientDetails.pacientDiagnosis}
            onChange={(e) => setPatientDetails({ ...patientDetails, pacientDiagnosis: e.target.value })}
          />
          <input
            type="text"
            placeholder="Doctor Name"
            value={patientDetails.doctorName}
            onChange={(e) => setPatientDetails({ ...patientDetails, doctorName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Patient Status"
            value={patientDetails.pacientStatus}
            onChange={(e) => setPatientDetails({ ...patientDetails, pacientStatus: e.target.value })}
          />
          <button onClick={() => addPatient(hospitalID1, levelID1, roomID1, patientDetails)}>
            Add Patient
          </button>
        </div>
      </div>
    </div>
  );
}

export default HospitalData;
