const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
    },
    phone_number: {
        type: Number,
        trim: true
    },
    avatar: {
        type: String
    },
    preferences: {
        type: Object
    },
    date: {
        type: Date,
        default: Date.now
    }
},
    {
        collection: 'users'
    }
)


const User = mongoose.model('User', UserSchema);

module.exports = User;