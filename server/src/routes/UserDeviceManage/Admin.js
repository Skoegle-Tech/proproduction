const User = require("../../DB/models/User")
const DeviceToken = require("../../DB/models/DeviceToken")

const ListCustommerDevices =async (req, res) => {
    try {
      const devices = await DeviceToken.find({ custommerId: req.params.custommerId });
      if (devices.length === 0) {
        return res.status(404).json({ message: 'No devices found for this customer' });
      }
      res.status(200).json(devices);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }



  module.exports={ListCustommerDevices}