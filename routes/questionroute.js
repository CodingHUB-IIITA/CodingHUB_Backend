const express = require('express');
const Router = express.Router();

const {getQuestionById, createquestion,updateQuestion,searchQuestions,deleteQuestion} = require("../controllers/create_question")
const{isSignedIn,isAuthenticated,isModerator} = require("../controllers/auth");
const { getUserById } = require('../controllers/user');
// Params
// Router.param("questionId", getQuestionById);
Router.param("userId", getUserById);
// Routes
Router.post('/question/create/:userId',isSignedIn,isAuthenticated,isModerator,createquestion);
// Router.post('/question/create',createquestion); //---- for testing---
Router.put("/question/update/:questionId/:userId",isSignedIn,isAuthenticated,isModerator,updateQuestion );
Router.delete("/question/delete/:questionId/:userId",isSignedIn,isAuthenticated,isModerator,deleteQuestion );
// Router.delete("/question/delete/:questionId",deleteQuestion ); //---- for testing---
Router.get("/question/search",searchQuestions);

module.exports = Router;