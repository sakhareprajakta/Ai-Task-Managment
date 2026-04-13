const express =  require("express");
const router = express.Router();
const {createEmp, getAllEmp}= require("../controller/empController");

 router.get("/empList", getAllEmp);
 router.post("/create", createEmp);

 module.exports = router;

