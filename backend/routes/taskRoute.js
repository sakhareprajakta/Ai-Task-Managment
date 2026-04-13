// const express =  require("express");
// const router = express.Router();
// const {suggestTask, createTask, getAllTask} = require("../controller/taskController");

//  router.post("/suggest", suggestTask);
//  router.post("/createTask",createTask);
//  router.get("/getTaskList", getAllTask);

//  module.exports = router;

const express = require("express");
const router = express.Router();
const axios = require("axios");
const { suggestTask, createTask, getAllTask, deleteTask } = require("../controller/taskController");

router.post("/suggest", suggestTask);
router.post("/createTask", createTask);
router.get("/getTaskList", getAllTask);
router.delete("/:id", deleteTask);

// List models debug route
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
