const mongoose = require("mongoose");
const logSchema = new mongoose.Schema({
    deviceName: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    date: { type: String, required: true }, // Format: "DD-MM-YYYY"
    time: { type: String, required: true }  // Format: "HH:MM:SS"
  });
  
const Log = mongoose.model("VmargLogs", logSchema);
const Realtime = mongoose.model("VmargRealtime", logSchema);

module.exports={Log,Realtime}