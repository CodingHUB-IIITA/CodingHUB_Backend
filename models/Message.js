const mongoose=require("mongoose");
var Schema=mongoose.Schema;
var messageSchema=new Schema({
    Sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Content:{
        type:String
    },
    Chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    }
});
module.exports=mongoose.model("Message",messageSchema);