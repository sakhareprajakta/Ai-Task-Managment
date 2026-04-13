require("dotenv").config();

const express = require("express");
const cors= require("cors");
const mongoose = require("mongoose");

const PORT=5000;

const app = express();
app.use(express.json());
app.use(cors());

const empRoutes = require("./routes/empRoutes");
const taskRoute = require("./routes/taskRoute");


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("mongodb connected"))
.catch(err=>console.error(err));


app.use("/api/emp", empRoutes);
app.use("/api/task",taskRoute);




app.listen(PORT , ()=>console.log("server is running on PORT",PORT))


/* mongodb+srv://sakhareprajakta2_db_user:<db_password>@cluster1.wy14wcx.mongodb.net/?appName=Cluster1 */
/* MONGO_URL=mongodb+srv://PrajAdmin:prajakta@cluster1.bgkx3ux.mongodb.net/?appName=Cluster1 */