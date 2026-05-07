
const express = require("express");
const router = express.Router();
const axios = require("axios");

const { protect, adminOnly } = require("../middleware/auth");
const {
  suggestTask,
  createTask,
  getAllTask,
  updateTask,
  deleteTask
} = require("../controller/taskController");

router.post("/suggest", protect, suggestTask);
router.post("/createTask", protect, adminOnly, createTask);
router.get("/getTaskList", protect, getAllTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);

// Debug route (OK to keep)
router.get("/list-models", async (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  try {
    const response = await axios.get(
      "https://generativelanguage.googleapis.com/v1beta/models",
      { params: { key } }
    );

    const models = response.data.models
      .filter(m => m.supportedGenerationMethods?.includes("generateContent"))
      .map(m => m.name);

    res.json({ availableModels: models });
  } catch (error) {
    res.status(500).json({ error: error?.response?.data || error.message });
  }
});

module.exports = router;
