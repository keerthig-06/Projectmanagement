import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");

    const API = "https://projectmanagement-dezx.onrender.com/";

    // Get tasks from backend
    const getTasks = async () => {
        try {
            const response = await axios.get(API);
            setTasks(response.data);
        } catch (error) {
            console.log("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        getTasks();
    }, []);

    // Add a new task
    const addTask = async () => {
        if (!title.trim()) {
            alert("Please enter a task!");
            return;
        }

        try {
            await axios.post(API, { title });
            setTitle("");
            getTasks();
        } catch (error) {
            console.log("Error adding task:", error);
        }
    };

    // Update task status
    const updateTask = async (id, status) => {
        try {
            await axios.patch(API + "/" + id, { status });
            getTasks();
        } catch (error) {
            console.log("Error updating task:", error);
        }
    };

    // Delete a task
    const deleteTask = async (id) => {
        try {
            await axios.delete(API + "/" + id);
            getTasks();
        } catch (error) {
            console.log("Error deleting task:", error);
        }
    };

    return (
        <div className="App">
            <h1>Task Manager Dashboard</h1>

            <div className="input-area">
                <input
                    type="text"
                    placeholder="Enter your task"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <button onClick={addTask}>Add Task</button>
            </div>

            <h2>My Tasks</h2>

            {tasks.length === 0 ? (
                <p>No tasks yet. Add your first task!</p>
            ) : (
                tasks.map((task) => (
                    <div className="task" key={task._id}>
                        <span>
                            {task.title} - {task.status}
                        </span>

                        <select
                            value={task.status}
                            onChange={(e) =>
                                updateTask(task._id, e.target.value)
                            }
                        >
                            <option value="Pending">Pending</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                        </select>

                        <button
                            onClick={() => deleteTask(task._id)}
                        >
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default App;
