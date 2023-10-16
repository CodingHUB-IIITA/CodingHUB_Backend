const express=require('express');
const { createTopic, updateTopic, getTopicById, deleteTopic, searchTopic } = require('../controllers/topic');

var router=express.Router();
router.param("topicId",getTopicById);
router.post('/topic/create/', createTopic);
router.put('/topic/update/:topicId',updateTopic);
router.delete('/topic/delete/:topicId',deleteTopic);


router.get("/topic/search",searchTopic);
module.exports=router;