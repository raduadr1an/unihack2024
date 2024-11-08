import React, { useEffect, useState } from "react";
import { ref, onValue, set, push } from "firebase/database";
import database from "./firebaseConfig";

function HospitalData() {
  const [hospitals, setHospitals] = useState([]);
  const [hospitalID1, setHospitalID1] = useState(""); // To store hospital ID
  const [levelID1, setLevelID1] = useState(""); // To store level ID
  const [roomID1, setRoomID1] = useState(""); // To store room ID
  const [levelName, setLevelName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    age: "",
    diagnosis: "",
    doctor: "",
    status: ""
  });

  // Fetching data from Firebase Realtime Database
  useEffect(() => {
    const hospitalsRef = ref(database, "hospitals");

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

  // Function to add a new level to a hospital
  const addLevel = (hospitalID1, levelName) => {
    const levelsRef = ref(database, `hospitals/${hospitalID1}/levels`);
    const newLevelRef = push(levelsRef); // Use push to create a new level
    set(newLevelRef, { name: levelName, rooms: {} }); // Initialize rooms as an empty object
  };

  // Function to add a new room to a level
  const addRoom = (hospitalID1, levelID1, roomNumber) => {
    const roomsRef = ref(database, `hospitals/${hospitalID1}/levels/${levelID1}/rooms`);
    const newRoomRef = push(roomsRef); // Use push to create a new room
    set(newRoomRef, { roomNumber: roomNumber, isOccupied: false, patients: {} });
  };

  // Function to add a new patient to a room
  const addPatient = (hospitalID1, levelID1, roomID1, patientDetails) => {
    const patientsRef = ref(database, `hospitals/${hospitalID1}/levels/${levelID1}/rooms/${roomID1}/patients`);
    const newPatientRef = push(patientsRef); // Use push to create a new patient
    set(newPatientRef, { ...patientDetails });
  };

  return (
    <div>
      <h1>Hospitals</h1>
      {hospitals.map((hospital) => (
        <div key={hospital.id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
          <h2>Hospital: {hospital.name}</h2>
          {hospital.levels && (
            <div style={{ marginLeft: "20px" }}>
              <h3>Levels</h3>
              {Object.keys(hospital.levels).map((levelKey) => {
                const level = hospital.levels[levelKey];
                return (
                  <div key={levelKey} style={{ marginBottom: "10px" }}>
                    <h4>Level: {level.name}</h4>
                    {level.rooms && (
                      <div style={{ marginLeft: "20px" }}>
                        <h5>Rooms</h5>
                        {Object.keys(level.rooms).map((roomKey) => {
                          const room = level.rooms[roomKey];
                          return (
                            <div key={roomKey} style={{ marginBottom: "10px" }}>
                              <h6>Room {room.roomNumber}</h6>
                              {room.patients && (
                                <div style={{ marginLeft: "20px" }}>
                                  <h6>Patients</h6>
                                  {Object.keys(room.patients).map((patientKey) => {
                                    const patient = room.patients[patientKey];
                                    return (
                                      <div key={patientKey} style={{ marginBottom: "5px", paddingLeft: "10px", borderLeft: "2px solid #ddd" }}>
                                        <p><strong>Name:</strong> {patient.name}</p>
                                        <p><strong>Age:</strong> {patient.age}</p>
                                        <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>
                                        <p><strong>Doctor:</strong> {patient.doctor}</p>
                                        <p><strong>Status:</strong> {patient.status}</p>
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

      {/* Form to add a new level */}
      <div>
        <h3>Add New Level</h3>
        <select onChange={(e) => setHospitalID1(e.target.value)}>
          <option value="">Select Hospital</option>
          {hospitals.map((hospital) => (
            <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
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
          {hospitals.find(h => h.id === hospitalID1)?.levels && 
            Object.keys(hospitals.find(h => h.id === hospitalID1).levels).map(levelKey => (
              <option key={levelKey} value={levelKey}>{hospitals.find(h => h.id === hospitalID1).levels[levelKey].name}</option>
            ))}
        </select>
        <input
          type="number"
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
          {hospitals.find(h => h.id === hospitalID1)?.levels[levelID1]?.rooms && 
            Object.keys(hospitals.find(h => h.id === hospitalID1).levels[levelID1].rooms).map(roomKey => (
              <option key={roomKey} value={roomKey}>Room {hospitals.find(h => h.id === hospitalID1).levels[levelID1].rooms[roomKey].roomNumber}</option>
            ))}
        </select>
        <input
          type="text"
          placeholder="Patient Name"
          value={patientDetails.name}
          onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age"
          value={patientDetails.age}
          onChange={(e) => setPatientDetails({ ...patientDetails, age: e.target.value })}
        />
        <input
          type="text"
          placeholder="Diagnosis"
          value={patientDetails.diagnosis}
          onChange={(e) => setPatientDetails({ ...patientDetails, diagnosis: e.target.value })}
        />
        <input
          type="text"
          placeholder="Doctor"
          value={patientDetails.doctor}
          onChange={(e) => setPatientDetails({ ...patientDetails, doctor: e.target.value })}
        />
        <input
          type="text"
          placeholder="Status"
          value={patientDetails.status}
          onChange={(e) => setPatientDetails({ ...patientDetails, status: e.target.value })}
        />
        <button onClick={() => addPatient(hospitalID1, levelID1, roomID1, patientDetails)}>Add Patient</button>
      </div>
    </div>
  );
}

export default HospitalData;
