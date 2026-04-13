const Emp = require("../model/Emp");

//create Emp
  exports.createEmp= async (req,res)=>{
     try{
     const {empId, empName, empSkills} = req.body;
     const emp = new Emp({empId, empName, empSkills});
     await emp.save();
     res.json(emp);

    }catch(error){
        console.log("Error while saving emp",error);
      res.status(500).json({"error" :"something wrong server error"})
    }
  }

//Get Emp
 exports.getAllEmp = async(req, res)=>{
   try{
     const emp= await Emp.find();
     res.json(emp);

   }catch(error)
   {
       console.log("Error while saving emp",error);
         res.status(500).json({"error" :"something wrong server error"});
   }
 }