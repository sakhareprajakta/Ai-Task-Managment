const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  taskTitle :String,
  taskDesc: String,
  assignedEmp: String,
  estimatedTime: String,
})

module.exports = mongoose.model("Task",TaskSchema);