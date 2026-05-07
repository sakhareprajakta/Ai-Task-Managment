const mongoose = require("mongoose");

const EmpSchema = new mongoose.Schema(
  {
  empId:{type:String, requied: true, unique:true},
  empName: {type:String, required:true},
  empSkills:{type:String},
  userId:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
 },
 {
  timestamps:true
})

module.exports = mongoose.model("Emp",EmpSchema);