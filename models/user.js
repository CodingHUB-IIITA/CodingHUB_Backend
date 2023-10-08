const mongoose = require("mongoose");

var Schema=mongoose.Schema;
var userSchema=new Schema({
    name:{
        type:String,
        required: true,
        maxlength:32,
        trim:true
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true
       },
    email:{
        type:String,
        required: true,
        unique:true,
        trim:true
    },
    encryptedpassword: {
        type: String,
        required: false
       },
    salt:String,
    pic:{
        type: String,
        required: true,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    notifications:[
        {
            chat: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Chat"
            },

            message: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
            }
             
        }
    ],
    purchases : {
        type: Array,
        default: []
       },
       permission: {
        type: Number,
        default: 0
       },
},{timestamps: true});
userSchema.methods={
    securePassword: function(pswrd){
        if(!pswrd)return "";
        try{
            return crypto.createHmac('sha256',this.salt).update(pswrd).digest('hex');
        }
        catch(err){
            console.log("Error in saving password");
        }
    },
    authenticate: function(pswrd){
        return this.securePassword(pswrd)===this.encryptedpassword
    }
}
userSchema.virtual("password")
.set(function(password){
    this._password=password;
    this.salt=uuidv1();
    this.encryptedpassword=this.securePassword(password);
},{timestamps})
.get(function(){
    return this._password;
})
module.exports=mongoose.model("User",userSchema);