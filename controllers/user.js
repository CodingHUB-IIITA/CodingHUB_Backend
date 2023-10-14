const User = require("../models/user");
const Chat = require("../models/Chat");



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


