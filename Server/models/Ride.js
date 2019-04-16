const mongoose = require('mongoose');
const schema = mongoose.Schema;

const pointSchema = new mongoose.Schema({
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

user: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'User'
},

},

{
  collection: 'rides'
}
)


const Ride = mongoose.model('Ride', RidesSchema);

module.exports = Ride;