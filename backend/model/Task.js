const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  taskTitle :{type:String, required:true},
  taskDesc:{type:String},
  assignedEmp: {type:String},
  assingedTo: {type:mongoose.Schema.Types.ObjectId, ref:"User"},
  estimatedTime:{type:String},
  status:
  {
    type:String,
    enum:["todo", "in-progress","done"],
    default:"todo"},
},
{
  timestamps:true
})

module.exports = mongoose.model("Task",TaskSchema);