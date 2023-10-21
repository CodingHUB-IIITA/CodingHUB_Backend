const mongoose=require("mongoose");
var Schema=mongoose.Schema;

var resourcesSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength:32
    },
    topics:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topics"
    }]
})


const method = (req,res) => {
    
}
module.exports=mongoose.model("resources",resourcesSchema);