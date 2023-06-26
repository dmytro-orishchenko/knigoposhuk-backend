const {Schema, model} = require("mongoose");
const CommentSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'book'
    },
    text: {
        type: String
    }
}, {timestamps: true});

module.exports = model('comment', CommentSchema)