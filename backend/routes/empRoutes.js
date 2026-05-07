 
const express = require("express");
const router = express.Router();

const { createEmp, getAllEmp, updateEmp, deleteEmp } = require("../controller/empController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/empList", protect, getAllEmp);
router.post("/create", protect, adminOnly, createEmp);
router.put("/:id", protect, adminOnly, updateEmp);
router.delete("/:id", protect, adminOnly, deleteEmp); // ✅ FIXED

module.exports = router;

