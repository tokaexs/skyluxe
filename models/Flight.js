const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true
  },
  airline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airline',
    required: true
  },
  aircraft: {
    type: String,
    required: true
  },
  departure: {
    airport: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    time: {
      type: Date,
      required: true
    }
  },
  arrival: {
    airport: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    time: {
      type: Date,
      required: true
    }
  },
  duration: {
    type: Number, 
    required: true
  },
  price: {
    economy: {
      type: Number,
      required: true
    },
    business: {
      type: Number,
      required: true
    },
    first: {
      type: Number,
      required: true
    }
  },
  availableSeats: {
    economy: {
      type: Number,
      required: true
    },
    business: {
      type: Number,
      required: true
    },
    first: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'delayed', 'cancelled', 'completed'],
    default: 'scheduled'
  },
  amenities: [{
    type: String,
    enum: ['wifi', 'meals', 'entertainment', 'lounge', 'priority']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});


flightSchema.index({ 'departure.time': 1, 'departure.airport': 1, 'arrival.airport': 1 });

flightSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.airline_code = ret.airline && ret.airline.iataCode ? ret.airline.iataCode : 'AI';
    ret.airline_name = ret.airline && ret.airline.airlineName ? ret.airline.airlineName : (typeof ret.airline === 'string' ? ret.airline : 'Air India');
    ret.aircraft_id = ret.aircraft;
    ret.departure_time = ret.departure?.time;
    ret.arrival_time = ret.arrival?.time;
    ret.origin = ret.departure?.airport;
    ret.destination = ret.arrival?.airport;
    return ret;
  }
});

module.exports = mongoose.model('Flight', flightSchema); 