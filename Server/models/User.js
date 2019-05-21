const mongoose = require('mongoose');
const schema = mongoose.Schema;

const preferencesSchema = new schema({
    smoking: String,
    pets: String,
    chattiness: String,
    music: String,
  })

const carSchema= new schema({
    make: String,
    model: String,
    type: String,
    color: String,
    registered_year: Number
  })

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

    bio:{
        type: String
    },
    
    preferences: preferencesSchema,

    cars: [carSchema],
    
    token: String,

    device_token: String,

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