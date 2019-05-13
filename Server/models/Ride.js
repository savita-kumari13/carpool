const mongoose = require('mongoose');
const schema = mongoose.Schema;

const pointSchema = new schema({
    type: {
      type: String,
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    }
  });

const carSchema= new schema({
  make: String,
  model: String,
  type: String,
  color: String,
  registered_year: Number
})

const preferencesSchema = new schema({
  smoking: String,
  pets: String,
  chattiness: String,
  music: String,
})

const userSchema = new schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
  },
  name: String,
  phone_number: Number,
  preferences: preferencesSchema,
  status: String,
  avatar: String,
  bio: String,
  car: carSchema,
})

const bookedUserSchema = new schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
  },
  name: String,
  phone_number: Number,
  preferences: Object,
  seats_booked: Number,
  status: String,
  avatar: String,
  bio: String
});

const RidesSchema = new schema({

  pick_up_name: {
    type : String,
    required: true,
  },

  pick_up_coordinates: pointSchema,

  drop_off_name: {
    type : String,
    required: true
  },

  drop_off_coordinates: pointSchema,

offered_ride_passengers_no: {
  type: Number,
  required: true,
},

offered_ride_price: {
  type: Number,
  required: true,
},

offered_ride_info: {
  type: String,
},

offered_ride_date_time: {
  type: Date,
  default: Date.now,
  required: true,
},

offered_user: userSchema,

booked_user: [bookedUserSchema]
},

{
  collection: 'rides'
}
)


const Ride = mongoose.model('Ride', RidesSchema);

module.exports = Ride;