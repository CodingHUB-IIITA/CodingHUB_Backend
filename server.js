require('dotenv').config();
const mongoose=require("mongoose");
const express=require("express");
const app= express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
//Adding parsers
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


const authRoutes = require("./routes/auth");
const question = require('./routes/questionroute');
const chatRoutes=require("./routes/chat");

const topicRoutes=require("./routes/topic");

const userRoutes=require("./routes/user");

const resourceRoutes = require("./routes/resources");
// APIs
app.use('/api', question);
app.use("/api", authRoutes);
app.use("/api", authRoutes);
app.use("/api",chatRoutes);
app.use("/api",topicRoutes);
app.use("/api",userRoutes);
app.use("/api",resourceRoutes);
const port=process.env.PORT || 8000
mongoose.connect(process.env.DATABASE,{})
.then(()=>{
    console.log("DataBase connetced");
    console.log(`Port connected on ${port}`);
})

app.listen(port, ()=> {
    console.log(`app is running at port ${port}`)
})


