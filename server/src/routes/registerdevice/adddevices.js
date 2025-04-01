const Device = require("../../DB/models/device")
const User = require("../../DB/models/User")
const CustomerDevice = require("../../DB/models/customerDevice")

const generateDeviceCode = () => {
    return Math.random().toString().slice(2, 18);
  };
  


const AddDeviceforRegister = async (req, res) => {
    try {
      const { deviceName, nickname } = req.body;
  
      // Check if a device with the same name or code already exists
      const existingDevice = await Device.findOne({ deviceName });
      if (existingDevice) {
        return res.status(400).json({ error: 'Device with this name already exists' });
      }
  
      // Generate a unique 16-digit random code and ensure no duplicate exists
      let deviceCode;
      let isUnique = false;
      while (!isUnique) {
        deviceCode = generateDeviceCode();
        const duplicateCode = await Device.findOne({ deviceCode });
        if (!duplicateCode) {
          isUnique = true;
        }
      }
  
      const newDevice = new Device({ deviceName, deviceCode, nickname });
      await newDevice.save();
      res.status(201).json(newDevice);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create device', details: error.message });
    }
  }



  const GetAddedDevices =  async (req, res) => {
    try {
      const devices = await Device.find();
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  }



  const UpdateRegisterddevice = async (req, res) => {
    try {
      const { deviceName, nickname } = req.body;
      const device = await Device.findByIdAndUpdate(
        req.params.id,
        { deviceName, nickname },
        { new: true }
      );
      if (!device) return res.status(404).json({ error: 'Device not found' });
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update device' });
    }
  }


  const deletedmargDevices = async (req, res) => {
    try {
      const device = await Device.findByIdAndDelete(req.params.id);
      if (!device) return res.status(404).json({ error: 'Device not found' });
      res.status(200).json({ message: 'Device deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete device' });
    }
  }


  const verifuserwithdevice = async (req, res) => {
    try {
      const { deviceName, deviceCode, custommerId, nickname } = req.body;
  
      // Step 1: Check if the device exists and matches the provided deviceName and deviceCode
      const device = await Device.findOne({ deviceName, deviceCode });
      if (!device) {
        return res.status(400).json({ message: 'Device not found or incorrect details provided' });
      }
  
      // Step 2: Find the user by custommerId
      const user = await User.findOne({ custommerId });
      if (!user) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      // Check if the device is already assigned to this user
      const isDeviceAssigned = user.device.some(d => d.deviceCode === deviceCode);
      if (isDeviceAssigned) {
        return res.status(400).json({ error: 'Device is already assigned to this customer' });
      }
  
      // Add or update the device in the user's device list
      user.device.push({
        deviceName,
        deviceCode,
        nickname: nickname || device.nickname || '',
      });
  
      await user.save();
  
      // Step 3: Save or update the device assignment in the CustomerDevice collection
      const existingCustomerDevice = await CustomerDevice.findOne({ custommerId, deviceCode });
      if (existingCustomerDevice) {
        existingCustomerDevice.nickname = nickname || device.nickname || '';
        await existingCustomerDevice.save();
      } else {
        const customerDevice = new CustomerDevice({
          custommerId,
          deviceCode,
          deviceName,
          nickname: nickname || device.nickname || '',
        });
        await customerDevice.save();
      }
  
      res.status(200).json({ message: 'Device verified and assigned successfully', user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to verify and assign device', details: error.message });
    }
  };
  

const AddbyAdmin = async (req, res) => {
    try {
      const { custommerId, deviceName, nickname } = req.body;
  
      // Check if a record with the same custommerId and deviceCode already exists
      const existingRecord = await CustomerDevice.findOne({ custommerId });
      if (existingRecord) {
        return res.status(400).json({ error: 'Device is already assigned to this customer' });
      }
  
      // Create and save the new customer-device record
      const customerDevice = new CustomerDevice({
        custommerId,
        // deviceCode,
        deviceName,
        nickname: nickname || ''
      });
  
      await customerDevice.save();
      res.status(201).json({ message: 'Device added to CustomerDevice collection successfully', customerDevice });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add device to CustomerDevice collection', details: error.message });
    }
  }

  const deleteDeviceForUser = async (req, res) => {

    console.log(req.body)
    try {
      const { deviceName } = req.body;
          const {custommerId} = req.user
     
      const user = await User.findOne({ custommerId });
      if (!user) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      // Find the device in the user's device list by deviceName
      const deviceIndex = user.device.findIndex(d => d.deviceName === deviceName);
      if (deviceIndex === -1) {
        return res.status(400).json({ error: 'Device not found in user device list' });
      }
  
      // Remove the device from the user's device list
      user.device.splice(deviceIndex, 1);
      await user.save();
  
      // Step 2: Remove the device from the CustomerDevice collection
      const customerDevice = await CustomerDevice.findOneAndDelete({ custommerId, deviceName });
      if (!customerDevice) {
        return res.status(400).json({ error: 'Device not found in CustomerDevice collection' });
      }
  
      res.status(200).json({ message: 'Device removed successfully from both collections' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove device', details: error.message });
    }
  };
  

  module.exports={deletedmargDevices,UpdateRegisterddevice,GetAddedDevices,AddDeviceforRegister,verifuserwithdevice,AddbyAdmin,deleteDeviceForUser}