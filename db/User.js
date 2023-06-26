const {Schema, model} = require("mongoose");
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        default: 'user'
    }, // admin, user
    favoritesBooks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'book'
        }
    ]
}, {timestamps: true});

module.exports = model('user', UserSchema);