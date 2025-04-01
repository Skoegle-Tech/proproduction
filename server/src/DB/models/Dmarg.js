const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the location schema
const locationSchema = new Schema({
  deviceName: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: true
  },
  longitude: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  fromTime: {
    type: String,
    required: true
  },
  toTime: {
    type: String,
    required: true
  }
});

// Define the testvidios schema
const testvidiosSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  deviceName: {
    type: String,
    required: false
  },
  date: {
    type: String,
    required: false
  },
  fromtime: {
    type: String,
    required: false
  },
  totime: {
    type: String,
    required: false
  }
}, { timestamps: false });

// Create models from the schemas
const getlocation = mongoose.model('getlocation', locationSchema);
const testvidios = mongoose.model('testvidios', testvidiosSchema);

module.exports = {
  getlocation,
  testvidios
};