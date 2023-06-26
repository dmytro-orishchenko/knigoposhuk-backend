const {Schema, model} = require("mongoose");
const BookSchema = new Schema({
    image: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    authorName: String,
    genre: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'author'
    },
}, {timestamps: true});

module.exports = model('book', BookSchema);