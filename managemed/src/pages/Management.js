import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, update, get, push, set } from 'firebase/database';
import './Management.css';

function Management() {
  const [user, setUser] = useState(null);
  const [hospitalData, setHospitalData] = useState({});
  const [editMode, setEditMode] = useState({});
  const [newHospitalName, setNewHospitalName] = useState('');
  const [newFloorNumber, setNewFloorNumber] = useState('');
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const database = getDatabase();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchHospitalData();
      } else {
        navigate('/auth');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchHospitalData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const snapshot = await get(ref(database, 'hospitals'));
      if (snapshot.exists()) {
        setHospitalData(snapshot.val());
      } else {
        setHospitalData({});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load hospital data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e, submitFunction) => {
    e.preventDefault();
    submitFunction();
  };

  const addNewHospital = async () => {
    if (!newHospitalName.trim()) {
      setError('Please enter a hospital name');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const newHospitalRef = push(ref(database, 'hospitals'));
      await set(newHospitalRef, {
        hospitalName: newHospitalName,
        floor: {}
      });
      setNewHospitalName('');
      await fetchHospitalData();
    } catch (error) {
      console.error('Error adding hospital:', error);
      setError('Failed to add hospital. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (path, value) => {
    setIsLoading(true);
    setError(null);
    try {
      await update(ref(database), { [path]: value });
      await fetchHospitalData();
    } catch (error) {
      console.error('Error updating data:', error);
      setError('Failed to update data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addFloor = async (hospitalKey) => {
    if (!newFloorNumber.trim()) {
      setError('Please enter a floor number');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const newFloorRef = push(ref(database, `hospitals/${hospitalKey}/floor`));
      await set(newFloorRef, {
        floorNumber: newFloorNumber,
        roomInfo: {}
      });
      setNewFloorNumber('');
      await fetchHospitalData();
    } catch (error) {
      console.error('Error adding floor:', error);
      setError('Failed to add floor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addRoom = async (hospitalKey, floorKey) => {
    if (!newRoomNumber.trim()) {
      setError('Please enter a room number');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const newRoomRef = push(ref(database, `hospitals/${hospitalKey}/floor/${floorKey}/roomInfo`));
      await set(newRoomRef, {
        roomNumber: newRoomNumber,
        isOccupied: false,
        pacientInfo: {
          doctorName: '',
          pacientName: '',
          pacientAge: '',
          pacientDiagnosis: '',
          pacientStatus: ''
        }
      });
      setNewRoomNumber('');
      await fetchHospitalData();
    } catch (error) {
      console.error('Error adding room:', error);
      setError('Failed to add room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePatientInfo = async (path, field, value) => {
    setIsLoading(true);
    setError(null);
    try {
      await update(ref(database), { [`${path}/pacientInfo/${field}`]: value });
      await fetchHospitalData();
    } catch (error) {
      console.error('Error updating patient info:', error);
      setError('Failed to update patient information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoom = (room, path, roomKey) => (
    <div key={roomKey} className="room">
      <h4>{`Room ${room.roomNumber}`}</h4>
      <div className="room-info">
        <div>
          <strong>Doctor:</strong>
          <input
            type="text"
            defaultValue={room.pacientInfo?.doctorName || ''}
            onBlur={(e) => updatePatientInfo(path, 'doctorName', e.target.value)}
            placeholder="Enter doctor name"
          />
        </div>
        <div>
          <strong>Patient:</strong>
          <input
            type="text"
            defaultValue={room.pacientInfo?.pacientName || ''}
            onBlur={(e) => updatePatientInfo(path, 'pacientName', e.target.value)}
            placeholder="Enter patient name"
          />
        </div>
        <div>
          <strong>Age:</strong>
          <input
            type="number"
            defaultValue={room.pacientInfo?.pacientAge || ''}
            onBlur={(e) => updatePatientInfo(path, 'pacientAge', e.target.value)}
            placeholder="Enter age"
          />
        </div>
        <div>
          <strong>Diagnosis:</strong>
          <input
            type="text"
            defaultValue={room.pacientInfo?.pacientDiagnosis || ''}
            onBlur={(e) => updatePatientInfo(path, 'pacientDiagnosis', e.target.value)}
            placeholder="Enter diagnosis"
          />
        </div>
        <div>
          <strong>Status:</strong>
          <input
            type="text"
            defaultValue={room.pacientInfo?.pacientStatus || ''}
            onBlur={(e) => updatePatientInfo(path, 'pacientStatus', e.target.value)}
            placeholder="Enter status"
          />
        </div>
        <div className="room-status">
          <strong>Occupied:</strong>
          <input
            type="checkbox"
            checked={room.isOccupied}
            onChange={(e) => handleUpdate(`${path}/isOccupied`, e.target.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderFloor = (floor, path, hospitalKey, floorKey) => (
    <div key={floorKey} className="floor">
      <h3>{`Floor ${floor.floorNumber}`}</h3>
      <form className="add-room" onSubmit={(e) => handleFormSubmit(e, () => addRoom(hospitalKey, floorKey))}>
        <input
          type="text"
          placeholder="New room number"
          value={newRoomNumber}
          onChange={(e) => setNewRoomNumber(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Room'}
        </button>
      </form>
      <div className="rooms-container">
        {Object.entries(floor.roomInfo || {}).map(([roomKey, room]) =>
          renderRoom(room, `${path}/roomInfo/${roomKey}`, roomKey)
        )}
      </div>
    </div>
  );

  const renderHospital = (hospital, hospitalKey) => (
    <div key={hospitalKey} className="hospital">
      <button 
        onClick={() => toggleEditMode(hospitalKey)} 
        className={`hospital-btn ${editMode[hospitalKey] ? 'active' : ''}`}
      >
        {hospital.hospitalName || 'Unnamed Hospital'}
      </button>
      {editMode[hospitalKey] && (
        <div className="hospital-details">
          <input
            type="text"
            placeholder="Edit hospital name"
            defaultValue={hospital.hospitalName}
            onBlur={(e) => handleUpdate(`hospitals/${hospitalKey}/hospitalName`, e.target.value)}
          />
          <form className="add-floor" onSubmit={(e) => handleFormSubmit(e, () => addFloor(hospitalKey))}>
            <input
              type="text"
              placeholder="New floor number"
              value={newFloorNumber}
              onChange={(e) => setNewFloorNumber(e.target.value)}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Floor'}
            </button>
          </form>
          <div className="floors-container">
            {Object.entries(hospital.floor || {}).map(([floorKey, floor]) =>
              renderFloor(floor, `hospitals/${hospitalKey}/floor/${floorKey}`, hospitalKey, floorKey)
            )}
          </div>
        </div>
      )}
    </div>
  );

  const toggleEditMode = (key) => {
    setEditMode((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchHospitalData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="management-container">
      <h1>Welcome, {user?.email}</h1>
      <form className="new-hospital" onSubmit={(e) => handleFormSubmit(e, addNewHospital)}>
        <input
          type="text"
          placeholder="Enter new hospital name"
          value={newHospitalName}
          onChange={(e) => setNewHospitalName(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Hospital'}
        </button>
      </form>
      {isLoading && <div className="loading-indicator">Loading...</div>}
      <div className="hospital-list">
        {Object.entries(hospitalData).map(([key, hospital]) =>
          renderHospital(hospital, key)
        )}
      </div>
    </div>
  );
}

export default Management;
