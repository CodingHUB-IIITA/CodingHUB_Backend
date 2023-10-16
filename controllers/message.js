const Message = require('../models/Message');

const SendMessage = async(req, res) => {
    try{

        const {sender,content,chat}=req.body;
        const mess= new Message({sender,content,chat});
        const savedMessage = await mess.save();

        res.status(200).json({
            data: savedMessage,
            success:true,
            message:"Message sent successfully",
        })

    }
    catch(err){
        console.error(err);
        console.log(err);
        res.status(500).json({
            message: err.message,
            success:false,
            data:"Error Sending Message",
        })
    }
};

const SeeMessage = async(req, res) => {
    try{

        const {sender,content,chat}=req.body;
        const AllMessages=await Message.find({chat:chat}).populate({sender}).populate({chat});
        res.status(200).json({
            data:AllMessages,
            success:true,
            message:"All Messages within this chat is displayed",
        })

    }
    catch(err)
    {
        console.error(err);
        console.log(err);
        res.status(500).json({
            success:false,
            message:err.message,
            data:"Error in Seeing Message",
        });
    }
};

module.exports = {SendMessage,SeeMessage};