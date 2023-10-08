const mongoose=require("mongoose");
var Schema=mongoose.Schema;
var messageSchema=new Schema({

});
module.exports=mongoose.model("Message",messageSchema);