
const DeviceToken = require("../../DB/models/DeviceToken")

const GetDeviceLogin = async (req, res) => {
    try {
      const { custommerId } =  req.user;
      const regex = new RegExp(`^${custommerId}`, "i"); // Create a case-insensitive regex pattern
  
      // Find documents matching the regex pattern
      const devices = await DeviceToken.find({ custommerId: { $regex: regex } });
  
      if (devices.length === 0) {
        return res.status(404).json({ message: "No devices found for the given customer ID." });
      }
  
      res.status(200).json(devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }

const DeleteDevice  = async (req, res) => {
    try {
      const { deviceString } = req.params;
  
      // Find and delete the document
      const deletedDevice = await DeviceToken.findOneAndDelete({ deviceString });
  
      if (!deletedDevice) {
        return res.status(404).json({ message: "Device not found with the given deviceString." });
      }
  
      res.status(200).json({
        message: "Device successfully deleted.",
        deletedDevice,
      });
    } catch (error) {
      console.error("Error deleting device:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }


  module.exports={GetDeviceLogin,DeleteDevice}
