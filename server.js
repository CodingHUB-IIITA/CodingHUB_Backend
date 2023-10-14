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
app.use("/api", authRoutes);

const question = require('./routes/questionroute');
app.use('/api', question);

const authRoutes = require("./routes/auth");
const chatRoutes=require("./routes/chat");
app.use("/api", authRoutes);
app.use("/api",chatRoutes);

const port=process.env.PORT || 8000
mongoose.connect(process.env.DATABASE,{})
.then(()=>{
    console.log("DataBase connetced");
    console.log(`Port connected on ${port}`);
})

app.listen(port, ()=> {
    console.log(`app is running at port ${port}`)

})


