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
        required:true
    },
    LatestMessages:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Messsage"
        }
    ]

});
module.exports=mongoose.model("Chat",chatSchema);
