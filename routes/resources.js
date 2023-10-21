const express=require('express');
const { createTopic, updateTopic, getTopicById, deleteTopic, searchTopic } = require('../controllers/topic');
const { isSignedIn,isAuthenticated,isAdmin, isModerator } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');
const { createResource,updateResource,FindAllResources,findResourceById,deleteResource } = require('../controllers/resources');

var router=express.Router();
router.param("userId",getUserById);
router.param("resourceId",findResourceById);
router.post('/resource/create/:userId',isSignedIn,isAuthenticated,isAdmin,createResource);
router.put('/resource/update/:userId/:resourceId',isSignedIn,isAuthenticated,isAdmin,updateResource);
router.delete('/resource/delete/:userId/:resourceId',isSignedIn,isAuthenticated,isAdmin,deleteResource);
router.get("/resource/findAll",FindAllResources)


module.exports=router;