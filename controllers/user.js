const User = require("../models/user");
const Chat = require("../models/Chat");

// param
exports.getUserById=(req,res,next,id)=>{
    User.findById(id).then((user,err)=>{
        console.log(user);
    if(err || !user){
        return res.status(400).json({
            error:"Oops...There is not any user of this id in the database"
        });
    }

    req.profile=user;
    
    next();
});  
};

exports.getUser=(req,res)=>{
    req.profile.salt = undefined;
    req.profile.encry_password=undefined;
    return res.json(req.profile);
};

exports.getAllusers=(req,res)=>{
    User.find().then((users,err)=>{
        if(err){
            res.status(400).json({
                error: "No users found"
            })
        }

        res.json({
            users
        })
    })
};

exports.updateUser = async (req, res) => {
    
    // const {updatedQuestion} = req.body;
    const profile = req.body;
    const old = req.profile;

    if(!profile.role){
        profile.role = old.role
    }
    if(!profile.name){
        profile.name = old.name
    }
    if(!profile.pic){
        profile.pic = old.pic
    }
    if(!profile.email)[
        profile.email = old.email
    ]
    if(!profile.handles){
        profile.handles = old.handles;
    }
    else{
        // mergin array elements into set then making an array from that set
        profile.handles = [...new Set([...old.handles, ...profile.handles])]
    }

    

   await User.findByIdAndUpdate(req.profile._id, {
        name: profile.name,
        email: profile.email,
        pic: profile.pic,
        handles: profile.handles,
        role: profile.role
    },
    {
        new: true,
    }).then((updatedUser,err)=>{
        if(err){
            res.status(404).json({
                success: false,
                data: 'User not updated',
                message: err.message,
            });
        }
        res.json({updatedUser,old});
        
    })
}

exports.storeNotification = (req, res) => {
    const { userId, messageId, chatId } = req.body;

    User.findByIdAndUpdate(
        userId,
        {
            $push: {
                notifications: {
                    message: messageId,
                    chat: chatId
                }
            }
        },
        {
            new: true
        }
    ).then((done, err) => {
        if (err || !done) {
            return res.status(400).json({
                error: "Something went wrong"
            });
        }
        res.sendStatus(204); 
    });
};

exports.getNotifications = (req, res) => {
    const { id } = req.params;

    User.findById(id)
        .populate("notifications.message", 'sender content chat')
        .select("notifications")
        .exec()
        .then((notifications) => {
            return User.populate(notifications, {
                path: 'notifications',
                populate: {
                    path: 'message.chat',
                    populate: {
                        path: 'users',
                        select: 'name',
                        model: User
                    },
                    select: "chatName isGroupChat users",
                    model: Chat
                }
            });
        })
        .then((populatedNotifications) => {
            res.status(200).send(populatedNotifications);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        });
};

exports.removeNotification = (req, res) => {
    const { userId, chatId } = req.body;
    User.findByIdAndUpdate(
        userId,
        { $pull: { 'notifications': { 'chat': chatId } } },
        { new: true }
    )
        .select('notifications')
        .populate("notifications.message", "sender content chat")
        .then((removed) => {
            return User.populate(removed, {
                path: 'notifications',
                populate: {
                    path: 'message.chat',
                    populate: {
                        path: 'users',
                        select: 'name',
                        model: User
                    },
                    select: "chatName isGroupChat users",
                    model: Chat
                }
            });
        })
        .then((rem) => {
            res.status(200).json(rem);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        });
};

exports.storeHandles = (req,res) => {
    const userhandle = req.body.handles;
    const old = req.profile
    const handles_new = [...new Set([...old.handles, ...userhandle])]
    User.findByIdAndUpdate(old._id,{
        handles: handles_new
    },{
        new: true
    }).then((resp,err)=>{
        if(err){
            res.status(404).json({
                error: "Handles not updated",
                msg: {err}
            })
        }
        else{
            res.json(resp)
        }
    })
}

exports.updatePermissions = (req,res) =>{
    const new_role = req.body.role;
    User.findByIdAndUpdate(req.body._id,{
        role : new_role
    },{
        new:true
    }
    ).then((resp,err)=>{
        if(err){
            res.status(404).json({
                error: "Permission not updated",
                msg: {err}
            })         
        }
        else{
            res.json(resp);
        }
    })
}
