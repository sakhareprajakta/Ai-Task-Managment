require("dotenv").config();

const express = require("express");
const cors= require("cors");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

const empRoutes = require("./routes/empRoutes");
const taskRoute = require("./routes/taskRoute");
const authRoutes = require("./routes/authRoutes");


mongoose
.connect(process.env.MONGO_URI)
.then(()=>console.log("mongodb connected"))
.catch(err=>console.error(err));


app.use("/api/emp", empRoutes);
app.use("/api/task",taskRoute);
app.use("/api/auth",authRoutes);


app.get("/", (req, res)=>res.json({status:"ok", message:"TaskManager API running"}));

app.listen(PORT , ()=>console.log("server is running on PORT",PORT))

