// models/customerDevice.js (New Schema for Device-Customer Mapping)
const mongoose = require('mongoose');

const customerDeviceSchema = new mongoose.Schema({
  custommerId: { type: String, required: true },
//   deviceCode: { type: String, required: true },
  nickname: { type: String },
  deviceName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CustomerDevice', customerDeviceSchema);
