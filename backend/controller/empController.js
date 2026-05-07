const Emp = require("../model/Emp");

//create Emp
  exports.createEmp = async (req,res)=>{
     try{
     const {empId, empName, empSkills, userId} = req.body;
     const emp = new Emp({empId, empName, empSkills, userId});
     await emp.save();
     res.status(201).json(emp);

    }catch(error){
        console.error("createEmp error",error);
         res.status(500).json({error :"something wrong server error"})
    }
  };
  

//Get Emp
 exports.getAllEmp = async(req, res)=>{
   try{
    const filter = req.user.role === "admin" ? {} : {userId: req.user.id};
     const emps = await Emp.find(filter);
     res.json(emps);

   }catch(error)
   {
       console.log("getAllError",error.message);
       res.status(500).json({"error" :"something wrong server error"});
   }
 };

 //  update admin only

 exports.updateEmp = async(req, res)=>{
  try{
    const {id}= req.params;
    const update = await Emp.findByIdAndUpdate(id, req.body,{new:true});
    if(!updated) return res.stattus(400).json({error:"employee not found"});
    res.json(updated);

  }catch(error)
{
  console.error("updateEmp error:", error.message);
  res.status(500).json({error:"server error"});
}
 }

 exports.deleteEmp= async(req, res)=>{
  try{
    const{id}= req.params;
    await Emp.findByIdAndDelete(id);
    res.json({message:"message deleted"});

  }catch(error)
  {
    console.error("deleteEmp error", error.message);
    res.status(500).json({error:"server error"});
  }
 }