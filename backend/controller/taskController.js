
const Task = require("../model/Task");
const { getTaskPrediction, getTaskSuggestion } = require("../services/aiServices");

exports.suggestTask = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) return res.status(400).json({ error: "input is required" });
    const suggestion = await getTaskSuggestion(input);
    res.json({ suggestion });
  } catch (error) {
    if (error.rateLimited) {
      return res.status(429).json({
        error: "rate_limited",
        message: `Rate limit hit. Please wait ${error.retryAfter} seconds and try again.`,
        retryAfter: error.retryAfter
      });
    }
    console.error("suggestTask error:", error.message);
    res.status(500).json({ error: error.message || "Failed to get suggestion" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { taskTitle, taskDesc, assignedEmp } = req.body;
    const estimatedTime = await getTaskPrediction(taskDesc);
    const task = new Task({ taskTitle, taskDesc, assignedEmp, estimatedTime });
    await task.save();
    res.json(task);
  } catch (error) {
    console.error("createTask error:", error.message);
    res.status(500).json({ error: "Failed to create task" });
  }
};

exports.getAllTask = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("deleteTask error:", error.message);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

 