const question = require('../models/question');

const getQuestionById = (req,res,next,id) =>{
    question.findById(id).then((data,err)=>{
        console.log(data );
        if(err){
            res.status(500).json({
                success: false,
                data: 'internal server error',
                message: err.message,
            });
        }
        else{
            req.questionData = data;
            // console.log(req);
            next();
        }
    }).catch((err) => {
        res.status(400).json({ errors: err.errors });
    });
}

const createquestion = async (req, res) => {
    try {
        const { name, link, difficulty, tag } = req.body;
        const response = await question.create({ name, link, difficulty, tag });
        res.status(200).json({
            success: true,
            data: response,
            message: 'Entry Done Successfully'
        });
    } catch (err) {
        console.error(err);
        console.log(err);
        res.status(500).json({
            success: false,
            data: 'internal server error',
            message: err.message,
        });
    }
}

const updateQuestion = async (req, res) => {
    
    const {updatedQuestion} = req.body;
    const questionData = req.questionData;

   await question.findByIdAndUpdate(req.questionData._id, {
        name: updatedQuestion.name,
        link: updatedQuestion.link,
        difficulty: updatedQuestion.difficulty,
        tag: updatedQuestion.tag,
        solved:updatedQuestion.solved
    },
    {
        new: true,
    }).then((updatedQuestion,err)=>{
        if(err){
            res.status(404).json({
                success: false,
                data: 'Question not updated',
                message: err.message,
            });
        }
        res.json({updatedQuestion,questionData});
        
    }).catch((err) => {
        res.status(400).json({ errors: err.errors });
    });
}

const searchQuestions = (req,res) =>{
    const {tag, name, difficulty} = req.body;
    const query = {};
    if(tag){
        query.tag={$in: tag};
    }
    if(name){
        query.name = name;
    }
    if(difficulty){
        query.difficulty = difficulty;
    }

    question.find(query).sort({updatedAt: -1}).then((resp,err)=>{
        if(err){
            res.status(500).json({
                success: false,
                data: 'Question not Found',
                message: err.message,
            });
        }

        res.json(resp)
    }).catch((err) => {
        res.status(400).json({ errors: err.errors });
    });
}

const deleteQuestion = (req, res) =>{
    const to_delete = req.questionData;
    question.deleteOne(to_delete).then((quest,err)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to delete"
            })
        }
        res.json({
            message:"Deleted successfully",
            deleted: to_delete
        });
    }).catch((err) => {
        res.status(400).json({ errors: err.errors });
    });
}

module.exports = {createquestion,getQuestionById,updateQuestion, searchQuestions, deleteQuestion};