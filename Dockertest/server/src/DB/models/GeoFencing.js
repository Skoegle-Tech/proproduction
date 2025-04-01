
const mongoose = require('mongoose');
const geoFencingSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true
    },
    deviceName: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    radius: { 
         type: Number,
         required: true,
          default: 1 
        },
    lastTriggered: {
         type: String,
          enum: ["inside", "outside", null], 
          default: null 
        },
        main:{
            type: Number,
            required: true,
            default: 2
        },
        battery:{
            type: Number,
            required: true,
            default: 2
        }
});

const GeoFencing = mongoose.model('GeoFencing', geoFencingSchema);
module.exports = GeoFencing