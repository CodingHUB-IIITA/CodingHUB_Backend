const Chat=require("../models/Chat");

//creating getChatById middleware in order to retrieve chat record with a particular Id from the database
//findById is an asynchronous method in javascript which interacts with db which involves I/O opeartions which may take unpredictable amount of time
//req object represents the HTTP request and contains information about the request, such as parameters, query strings, and request body
const getChatById=(req,res,next,id)=>{
    Chat.findById(id)
    .then((chat,err)=>{
       if(!chat || err){
        return res.status(400).json({error:"Oopssss...., No chat found with this Id"});
       }
//attach the retrieved chat data to the incoming request object, making it accessible to other middleware functions 
       req.chatprofile=chat;
       next();
    })
}
//fetchchat is a middleware function to handle requests for fetching chat data for the logged-in user.
// const fetchChat=(req,res)=>{
//     try{
//        Chat
//        //find user with perfect match in a particular chat and then populate all the user details, group admin and latest message except the security 
//        //password to the chat then sort into descending order in order to have the latest message at recent
//        .find({users:{$eleMatch:{$eq : req.profile._id}}})
//        .populate("users","-password")
//        .populate("User","-password")
//        .populate("LatestMessages")
//        .sort({updatedAt:-1})
//        .then((chat,err)=>{
//         if(!chat || err){
//             return res.json({error: err});
//         }
//         //if no error found
//         chat=User
//         .populate(chat,{
//             path:"latestMessage.sender",
//             select:"name pic email"
//         })
//         res.status(200).json(chat);
//        })
//     }
//     catch(err){
//         res.json({
//            error:"Error while fetching chats"
//         })
//     }
// }


const accessChat=(req,res)=>{
    const {userId}=req.body.userId;
    if(!userId){
        return res.status(404).json({success:"Created Chat"});
    }
var isChat=Chat.find({isGroupChat:false,$and:[{users:{$eleMatch:{$eq:req.profile._id}}},{users:{$eleMatch:{$eq:userId}}}]})
    .populate("users","-password")
    .populate("LatestMessages")
    isChat=User.populate(isChat,{path:"latestMessage.sender",select:"name pic email"})
    .then((resp,err)=>{
        if(resp.length>0){
            res.send(resp);
        }
        else if(resp.length==0){
            var newChat={ChatName:`${req.body.name}`,isGroupChat:false,users:[userId,req.profile._id]}
            try{
                const createdChat=new Chat(newChat);
                createdChat
                .save()
                .then((resp)=>{
                    return res.json(resp);
                    console.log("New Chat Created")
                })
                .catch((err)=>{
                    console.log(err);
                })
            }
            catch{
                return res.status(404);
            }
        }
        else{
            return res.status(404);
        }
    })
}
//creating a middleware function to create group chat which require an array of users and chat name as essential parameters
const createGroupChat = (req, res) => {
    try {
        if (!req.body.users || !req.body.name) {
            return res.status(400).send({ message: "All the fields are required" });
        }

        // Validate user IDs and convert them to ObjectId
        const users = req.body.users;
        // const isValidObjectId = mongoose.Types.ObjectId.isValid;
        
        // // Check if any user IDs are invalid
        // if (users.some(userId => !isValidObjectId(userId))) {
        //     return res.status(400).send({ message: "Invalid user ID format" });
        // }

        if (users.length < 2) {
            return res.status(400).send({ message: "At least 2 users are required to create a group" });
        }

        // Add admin to the chat
        users.push(req.body.user);

        // Create a group chat with the provided properties
        const groupChat = Chat({
            isGroupChat: true,
            ChatName: req.body.name,
            User: req.body.user,
            users: users
        });

        // Save group chat to the database
        const savedChat =groupChat.save();

        if (savedChat) {
            console.log("Chat created Successfully");
            return res.json("Group chat created successfully");
        } else {
            return res.status(500).send({ message: "Failed to create group chat" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || "Internal Server Error" });
    }
};

//Creating a middleware function to add a member to a chat
//creating a member will require chat id and user id who is to be added


const addMember = (req, res) => {
    const { chatId, userId } = req.body;

    // Check if chatId and userId are valid ObjectIds

    Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true, useFindAndModify: false }
    )
    .populate("users", "-password")
    .populate("User", "-password")
    .then((response, err) => {
        if (err) {
            res.status(404).json({ error: "Chat not found" });
        } else {
            res.json(response);
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    });
};


//Creating a function to delet a member from a chat
 const deleteMember=(req,res)=>{
    const {chatId}=req.body;
    const {userId}=req.body;
Chat.findByIdAndUpdate(chatId,{$pull:{users:userId}},{new:true,userFindAndModify:false})
    .populate("users","-password")
    .populate("User","-password")
    .then((response,err)=>{
        if(err){
            response.status(404).json({error:"Chat not found"})
        }
        else{
            res.json(response);
        }
    })
 } 

const renameGroup =async (req,res) => {
    const {chatId, chatName} = req.body;

    const updatedChat =await Chat.findByIdAndUpdate(chatId,  {
        ChatName: chatName
    },
    {
        new: true,
        useFindAndModify: false
    })

    if(!updatedChat){
        res.status(400).json({
            error:"Chat not found"
        })
    }else{
        res.json(updatedChat)
    }
    }

  
 
module.exports= {accessChat,renameGroup,getChatById,createGroupChat,addMember,deleteMember};