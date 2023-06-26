const router = require("express").Router();
const User = require("../db/User");
const Comment = require("../db/comment");
const Book = require("../db/Book");


router.post(`/create`, async (req, res, next) => {
    const {userId, bookId, text} = req.body;
    try {
        const comment = await Comment.create({
            createdBy: userId,
            text: text,
            bookId: bookId,
        });
        comment.createdBy = await User.findOne({_id: userId});

        res.status(200).json(comment);
    } catch (err) {
        next(err)
    }
})

router.get('/allCommentByBook/:id', async (req, res, next) => {

    const {id} = req.params;

    try {
        const book = await Book.findOne({_id: id});
        if (!book) {
            return res.status(404).json({message: 'Book not found'})
        }
        const comments = await Comment
            .find({bookId: book?._id})
            .populate({path: 'createdBy', select: '_id name image'})
            .sort({createdAt: -1})
            .exec()

        res.status(200).json(comments);
    } catch (err) {
        next(err)
    }
})

router.get('/allByUser/:id', async (req, res, next) => {
    const {id} = req.params;

    try {
        const user = await User.findOne({_id: id});

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const userComments = await Comment
            .find({createdBy: user?._id})
            .populate({path: 'bookId', select: '_id title', populate: {path: 'author', select: '_id name'}})
            .sort({createdAt: -1})
            .exec()

        res.status(200).json(userComments);
    } catch (err) {
        next(err)
    }
})


module.exports = router;