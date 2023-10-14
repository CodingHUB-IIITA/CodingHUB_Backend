const question = require('../models/question');

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
module.exports = createquestion;