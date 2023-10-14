const express = require('express');
const Router = express.Router();

const createquestion = require('../controllers/create_question');

Router.post('/question', createquestion);
module.exports = Router;