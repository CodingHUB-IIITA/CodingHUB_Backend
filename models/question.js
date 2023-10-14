const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var questionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required:true,
    },
    difficulty: {
        type: Number,
        required:true,
    },
    tag: {
        type: [String],
        required:false,
    },
    solved: {
        type: Boolean,
        default: false
    },
});
module.exports = mongoose.model("question", questionSchema);