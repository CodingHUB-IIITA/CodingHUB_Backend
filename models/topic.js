const mongoose = require("mongoose");
var Schema=mongoose.Schema;
var topicSchema=new Schema({
    name:{
        type:String,
        required: true,
        maxlength:32,
        trim:true
    },
    descriptiom:{
        type:String,
    },
    ladder:{
        type: mongoose.Schema.Types.ObjectId,
         ref: "ladder"
    },
    blog:[{
        type: String
    }]
})


module.exports=mongoose.model("Topic",topicSchema);