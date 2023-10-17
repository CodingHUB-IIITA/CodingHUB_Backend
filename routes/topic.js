const express=require('express');
const { createTopic, updateTopic, getTopicById, deleteTopic, searchTopic } = require('../controllers/topic');
const { isSignedIn,isAuthenticated,isAdmin, isModerator } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

var router=express.Router();
router.param("topicId",getTopicById);
router.param("userId",getUserById);
router.post('/topic/create/:userId',isSignedIn,isAuthenticated,isModerator,createTopic);
router.put('/topic/update/:topicId/:userId',isSignedIn,isAuthenticated,isModerator,updateTopic);
router.delete('/topic/delete/:topicId/:userId',isSignedIn,isAuthenticated,isModerator,deleteTopic);


router.get("/topic/search",searchTopic);
module.exports=router;