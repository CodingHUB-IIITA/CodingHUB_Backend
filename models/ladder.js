const mongoose=require("mongoose");
var Schema=mongoose.Schema;
var ladderSchema=new Schema({
    name: {
        type: String,
        required: true
    },
    question: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "question"
        }
    ],
    link: {
        type: String
    },
});
module.exports=mongoose.model("ladder",ladderSchema);