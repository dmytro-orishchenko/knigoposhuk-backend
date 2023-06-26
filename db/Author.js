const {Schema, model} = require("mongoose");
const AuthorSchema = new Schema({
    image: {
        type: String,
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    books: [{
        type: Schema.Types.ObjectId,
        ref: 'book'
    }]
}, {timestamps: true});

module.exports = model('author', AuthorSchema);