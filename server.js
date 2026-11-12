
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

// Task Schema
const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Ongoing", "Completed"],
            default: "Pending"
        }
    },
    { timestamps: true }
);

// Task Model
const Task = mongoose.model("Task", TaskSchema);

// Home Route
app.get("/", (req, res) => {
    res.send("Project Management Backend is Running!");
});

// Get All Tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).json({
            message: "Could not fetch tasks."
        });
    }
});

// Create New Task
app.post("/tasks", async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required."
            });
        }

        const newTask = new Task({
            title: title.trim()
        });

        const savedTask = await newTask.save();

        res.status(201).json(savedTask);

    } catch (err) {
        console.error("Error creating task:", err);
        res.status(400).json({
            message: "Could not create task."
        });
    }
});

// Update Task Status
app.patch("/tasks/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json(updatedTask);

    } catch (err) {
        console.error("Error updating task:", err);
        res.status(400).json({
            message: "Could not update task."
        });
    }
});

// Delete Task
app.delete("/tasks/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(
            req.params.id
        );

        if (!deletedTask) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json({
            message: "Task deleted successfully."
        });

    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(400).json({
            message: "Could not delete task."
        });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
