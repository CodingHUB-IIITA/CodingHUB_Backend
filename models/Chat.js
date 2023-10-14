const mongoose=require("mongoose");
var Schema=mongoose.Schema;
var chatSchema=new Schema({
    User:[{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }],
    ChatName:{
        type:String,
        required:true
    },
    isGroupChat: {
        type:Boolean,
        required:true,
        default:true
    },
    
    users: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        }
    ],
  
    
    LatestMessages:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Messsage",
            required: false
        }
    ]

});
module.exports=mongoose.model("Chat",chatSchema);
