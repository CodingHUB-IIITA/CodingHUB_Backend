const express=require("express");
var router=express.Router();
const {getChatById,addMember,deleteMember,createGroupChat, renameGroup, accessChat, fetchChat}=require("../controllers/chat");
const { isSignedIn, isAdmin,isAuthenticated } = require("../controllers/auth");
router.post("/create/Groupchat",isSignedIn,createGroupChat);
router.put("/rename/Groupchat",isSignedIn,renameGroup);
router.put("/addto/group",isSignedIn,addMember);
router.delete("/removefromgroup",isSignedIn,deleteMember);
router.post("/access/chat",isSignedIn,accessChat);
router.get("/fetch/chat",isSignedIn,fetchChat);
module.exports=router;




