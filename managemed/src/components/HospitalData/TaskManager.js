import React, { useState, useEffect } from 'react';
import { ref, onValue, push, update, remove, set } from 'firebase/database'; // Added 'set' import
import { database } from "../../firebaseConfig"; // Make sure to adjust the import based on your project

function TaskManager({ hospitalID, levelID, roomID, patientID }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetching patient tasks from Firebase
  useEffect(() => {
    const tasksRef = ref(database, `hospital/${hospitalID}/floor/${levelID}/roomInfo/${roomID}/pacientInfo/${patientID}/tasks`);
    
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tasksArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTasks(tasksArray);
      } else {
        setTasks([]); // If no tasks are found for the patient
      }
    });

    return () => unsubscribe(); // Clean up on component unmount
  }, [hospitalID, levelID, roomID, patientID]);

  const handleAddTask = () => {
    if (!newTask) return;

    const tasksRef = ref(database, `hospital/${hospitalID}/floor/${levelID}/roomInfo/${roomID}/pacientInfo/${patientID}/tasks`);
    const newTaskRef = push(tasksRef);

    set(newTaskRef, {
      taskName: newTask,
      completed: false,
    });

    setNewTask(""); // Clear input after adding task
  };

  const handleToggleTask = (taskID, currentStatus) => {
    const taskRef = ref(database, `hospital/${hospitalID}/floor/${levelID}/roomInfo/${roomID}/pacientInfo/${patientID}/tasks/${taskID}`);
    update(taskRef, {
      completed: !currentStatus, // Toggle the task completion status
    });
  };

  const handleDeleteTask = (taskID) => {
    const taskRef = ref(database, `hospital/${hospitalID}/floor/${levelID}/roomInfo/${roomID}/pacientInfo/${patientID}/tasks/${taskID}`);
    remove(taskRef);
  };

  return (
    <div>
      <h2>Tasks for Patient</h2>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New Task"
      />
      <button onClick={handleAddTask}>Add Task</button>

      {tasks.length > 0 && (
        <div>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id, task.completed)}
                />
                <span>{task.taskName} ({task.completed ? 'Completed' : 'Pending'})</span>
                <button onClick={() => handleDeleteTask(task.id)} style={{ color: "red" }}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TaskManager;


