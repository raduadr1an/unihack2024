import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import database from "./firebaseConfig";

function HospitalData() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    // Reference to the "hospitals" node in the Realtime Database
    const hospitalsRef = ref(database, "hospitals");

    // Set up a real-time listener to fetch and update hospital data
    const unsubscribe = onValue(hospitalsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the data object into an array to use it in JSX
        const hospitalsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setHospitals(hospitalsArray);
      }
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();  // Remove listener using unsubscribe function
  }, []);

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
    </div>
  );
}

export default HospitalData;
