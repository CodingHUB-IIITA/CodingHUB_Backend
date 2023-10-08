const mongoose=require("mongoose");
var Schema=mongoose.Schema;

var blogSchema=new Schema({
    title:{
        type:String,
        required:true,
        maxlength:32
    },
    writer:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }],
    likes:{
        type:Number,
        default:0
    }
});
module.exports=mongoose.model("blogs",blogSchema);