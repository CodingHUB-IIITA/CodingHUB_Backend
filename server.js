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
const port=process.env.PORT || 8080
mongoose.connect(process.env.DATABASE,{})
.then(()=>{
    console.log("DataBase connetced");
    console.log(`Port connected on ${port}`);
})


