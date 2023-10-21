const question = require('../models/question');
const laddermodel = require('../models/ladder');

const getQuestionById = (req, res, next, id) => {
    question.findById(id).then((data, err) => {
        console.log(data);
        if (err) {
            res.status(500).json({
                success: false,
                data: 'internal server error',
                message: err.message,
            });
        }
        else {
            req.questionData = data;
            // console.log(req);
            next();
        }
    })
}

const createquestion = async (req, res) => {
    try {
        const { name, link, difficulty, tag } = req.body;
        const response = await question.create({ name, link, difficulty, tag });
        const dataid = await question.findOne({
            name: `${name}`
        }).exec();
        const questionIdString = dataid._id.toString();
        const createLadder = async () => {
            for (const element of tag) {
                const topic = await laddermodel.findOne({
                    name: `${element}`
                }).exec();

                // console.log(topic);//    NULLL
                const topicIdString = topic._id.toString();
                console.log(topicIdString);
                laddermodel.findById(topicIdString)
                .then(ladder => {
                    if (!ladder) {
                        console.log('Ladder Not Created');
                        return;
                    }
                    ladder.question.push(questionIdString);
                    return ladder.save();
                })
                .then(updatedLadder => {
                    console.log('Ladder updated:', updatedLadder);
                })
                .catch(error => {
                    console.error('Error updating ladder:', error);
                });
            }
        };
        createLadder();
        // console.log(dataid[0]);
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

    const { updatedQuestion } = req.body;
    const questionData = req.questionData;

    await question.findByIdAndUpdate(req.questionData._id, {
        name: updatedQuestion.name,
        link: updatedQuestion.link,
        difficulty: updatedQuestion.difficulty,
        tag: updatedQuestion.tag,
        solved: updatedQuestion.solved
    },
        {
            new: true,
        }).then((updatedQuestion, err) => {
            if (err) {
                res.status(404).json({
                    success: false,
                    data: 'Question not updated',
                    message: err.message,
                });
            }
            res.json({ updatedQuestion, questionData });

        })
}

const searchQuestions = (req, res) => {
    const { tag, name, difficulty } = req.body;
    const query = {};
    if (tag) {
        query.tag = { $in: tag };
    }
    if (name) {
        query.name = name;
    }
    if (difficulty) {
        query.difficulty = difficulty;
    }

    question.find(query).sort({ updatedAt: -1 }).then((resp, err) => {
        if (err) {
            res.status(500).json({
                success: false,
                data: 'Question not Found',
                message: err.message,
            });
        }

        res.json(resp)
    })
}

const deleteQuestion = async (req, res) => {
    // const to_delete = req.questionData;
    const { questionId } = req.params;
    // question.deleteOne(to_delete).then((quest, err) => {
    //     if (err) {
    //         return res.status(400).json({
    //             error: "Failed to delete"
    //         })
    //     }
    //     res.json({
    //         message: "Deleted successfully",
    //         deleted: to_delete
    //     });
    // })
    try {
        const ladderdeletion = async () => {
            const tags = (await question.findById(questionId).exec()).tag;
            for (const element of tags) {
                const topic = await laddermodel.findOne({
                    name: `${element}`
                }).exec();

                const topicId = topic._id.toString();
                const topicarray = topic.question;

                const index = topicarray.indexOf(questionId);
                if (index > -1) {
                    topicarray.splice(index, 1);
                }

                const update = await laddermodel.findByIdAndUpdate(topicId, {
                    name: element,
                    question: topicarray,
                })

                console.log(topicarray);
            }
            await question.findByIdAndDelete(questionId);
        }
        ladderdeletion();

        res.status(200).json({
            success: true,
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

module.exports = { createquestion, getQuestionById, updateQuestion, searchQuestions, deleteQuestion };