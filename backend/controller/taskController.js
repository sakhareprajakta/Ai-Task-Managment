const Task = require("../model/Task");
const { getTaskSuggestion, getTaskPrediction } = require("../services/aiServices");

// 🔥 AI Suggestion Controller
const suggestTask = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "Input is required" });
    }

    const suggestion = await getTaskSuggestion(input);

    res.status(200).json({ suggestion });

  } catch (error) {
    console.error("suggestTask error:", error?.message || error);

    res.status(500).json({
      suggestion: "Failed to get suggestion",
    });
  }
};

// 🔥 Create Task
const createTask = async (req, res) => {
  try {
    const { taskTitle, taskDesc, assignedEmp, assignedTo, status } = req.body;

    if (!taskTitle) {
      return res.status(400).json({ error: "Task title is required" });
    }

    // 👉 AI time prediction
    let estimatedTime = "";
    try {
      estimatedTime = await getTaskPrediction(taskTitle);
    } catch {
      estimatedTime = "2-4 hours"; // fallback
    }

    const task = await Task.create({
      taskTitle,
      taskDesc,
      assignedEmp,
      assignedTo,
      status,
      estimatedTime,
    });

    res.status(201).json(task);

  } catch (error) {
    console.error("createTask error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// 🔥 Get All Tasks
const getAllTask = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("getAllTask error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// 🔥 Update Task Status
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Task.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updated);

  } catch (error) {
    console.error("updateTask error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

// 🔥 Delete Task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Task.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });

  } catch (error) {
    console.error("deleteTask error:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// ✅ IMPORTANT EXPORT (THIS FIXES YOUR ERROR)
module.exports = {
  suggestTask,
  createTask,
  getAllTask,
  updateTask,
  deleteTask,
};