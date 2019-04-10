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
        required: true,
    },
    phone_number: {
        type: Number,
        unique: true,
        required: true,
        trim: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
},
    // {
    //     collection: 'users'
    // }
)


const User = mongoose.model('users', UserSchema);

module.exports = User;