const mongoose = require("mongoose");

const GeoFenceSchema = new mongoose.Schema({
  deviceName: { type: String, required: true, unique: true }, // Unique Device Name
  latitude: { type: Number, required: true }, // Geofence center
  longitude: { type: Number, required: true },
  radius: { type: Number, required: true, default: 1 }, // Radius in km (default: 1km)
  lastTriggered: { type: String, enum: ["inside", "outside", null], default: null }, // Last alert state
});

const GeoFence = mongoose.model("GeoFence", GeoFenceSchema);

module.exports = GeoFence;
