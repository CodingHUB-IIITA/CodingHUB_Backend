const express = require('express');
const Router = express.Router();

const {getQuestionById, createquestion,updateQuestion,searchQuestions,deleteQuestion} = require("../controllers/create_question")

// Params
Router.param("questionId", getQuestionById);

// Routes
Router.post('/question/create', createquestion);
Router.put("/question/update/:questionId",updateQuestion );
Router.delete("/question/delete/:questionId",deleteQuestion );
Router.get("/question/search",searchQuestions);

module.exports = Router;