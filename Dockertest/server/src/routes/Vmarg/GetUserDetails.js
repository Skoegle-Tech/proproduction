const User = require('../../DB/models/User');


async function findUsersByDeviceName(deviceName) {
    // Find all users that have a device with the specified name
    const users = await User.find({ "device.deviceName": deviceName });
    
    if (users && users.length > 0) {
      // Map through each user and extract relevant information
      const results = users.map(user => {
        // Find the specific device in this user's device array
        const matchedDevice = user.device.find(dev => dev.deviceName === deviceName);
       return {
          userDetails: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phoneNumber,
          },
          
        };
      });
        return results;
    } else {
      console.log(`No users found with device name: ${deviceName}`);
      return [];
    }
  }
  
  // Usage
module.exports = findUsersByDeviceName;