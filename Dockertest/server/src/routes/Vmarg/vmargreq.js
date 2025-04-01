
const GeoFencing = require("../../DB/models/GeoFencing");
const {Log,Realtime} = require("../../DB/models/Vmarg")
const haversineDistance = require("haversine-skoegle");
const Alert = require("./Alert");


const DeviceLogs = async (req, res) => {
  try {
    const { deviceName, latitude, longitude, date, time, main, battery } = req.body;
  

    console.log(main, battery)
  
    const geoFencings = await GeoFencing.findOne({ deviceName });
   
    if (!geoFencings) {
      const newLog = new Log({ deviceName, latitude, longitude, date, time });
      await newLog.save();

      await Realtime.findOneAndUpdate(
        { deviceName },
        { latitude, longitude, date, time },
        { new: true, upsert: true }
      );

      return res.status(201).json({ message: "Logs Created without geofencing", location: { latitude, longitude } });
    }
   
    const { latitude: fixedLat, longitude: fixedLong, radius, lastTriggered } = geoFencings;
    
    // Fixed line - using findOneAndUpdate instead of findByIdAndUpdate
    await GeoFencing.findOneAndUpdate(
      { deviceName },
      { main: parseFloat(main), battery: parseFloat(battery) },
      { new: true }
    );
    
    let geofencing = { activated: false, status: lastTriggered, fixedLat, fixedLong };
    const distance = haversineDistance(fixedLat, fixedLong, latitude, longitude);
   
    if (distance > radius) {
      if (lastTriggered === "inside" || lastTriggered === null) {
        console.log(`🚨 Geofencing Activated: Device ${deviceName} moved out of ${radius} km range!`);
        geofencing = { activated: true, status: "outside" };
        
        await GeoFencing.findOneAndUpdate(
          { deviceName }, 
          { lastTriggered: "outside", main: parseInt(main), battery: parseInt(battery) }
        );
      }
    } else {
      if (lastTriggered === "outside") {
        console.log(`✅ Geofencing Deactivated: Device ${deviceName} is back inside the ${radius} km range.`);
        geofencing = { activated: true, status: "inside", fixedLat, fixedLong };

        await GeoFencing.findOneAndUpdate(
          { deviceName }, 
          { lastTriggered: "inside", main: parseInt(main), battery: parseInt(battery) }
        );
      }
    }

    const newLog = new Log({ deviceName, latitude, longitude, date, time });
    await newLog.save();
    
    await Realtime.findOneAndUpdate(
      { deviceName },
      { latitude, longitude, date, time },
      { new: true, upsert: true }
    );

    const location = { latitude: newLog?.latitude, longitude: newLog?.longitude, distance };
    console.log(geofencing?.status, geofencing?.activated);
    
    if(geofencing?.activated) {
       Alert(deviceName, geofencing?.status, distance,latitude,longitude);
      return res.status(201).json({ message: "Logs Created", geofencing, location });
    }

    res.status(201).json({ message: "Logs Created", geofencing, location });
  } catch (error) {
    res.status(500).json({ message: "Error creating log", error });
  }
};

const addDeviceRealtime= async (req, res) => {
    try {
      const { deviceName, latitude, longitude, date, time } = req.body;
  
        const checkdevice = await Realtime.findOne({deviceName})
        if(checkdevice){
          return res.send("Device Exists")
        }
  
  
     
      const newLog = new Realtime({ deviceName, latitude, longitude, date, time });
      await newLog.save();
  
      res.status(201).json({ message: "Log created successfully", log: newLog });
    } catch (error) {
      res.status(500).json({ message: "Error creating log", error });
    }
  };
  
  const DeviceRealTime = async (req, res) => {
    try {
      const { deviceName } = req.params;
      const { latitude, longitude, date, time } = req.body;
  
      const updatedRealtime = await Realtime.findOneAndUpdate(
        { deviceName }, // Find real-time entry by deviceName
        { latitude, longitude, date, time }, // Update fields
        { new: true, upsert: true } // Return the updated document and create it if it doesn't exist
      );
  
      res.status(200).json({ message: "Real-time data updated", realtime: updatedRealtime });
    } catch (error) {
      res.status(500).json({ message: "Error updating real-time data", error });
    }
  };
  
//  const GetDeviceLogs= async (req, res) => {
//     const { deviceName, fromDate, toDate, fromTime, toTime } = req.query;
  
//     try {
//       const query = { ...(deviceName && { deviceName }) };
  
//       if (fromDate && toDate) {
//         query.date = {
//           $gte: fromDate,
//           $lte: toDate
//         };
//       }
  
//       if (fromTime && toTime) {
//         query.time = {
//           $gte: fromTime,
//           $lte: toTime
//         };
//       }
  
//       console.log("Query:", query); // Debugging the query being sent
  
//       const logs = await Log.find(query).sort({ date: 1, time: 1 }).select("deviceName latitude longitude date time");
  
//       res.status(200).json(logs);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error fetching logs", error });
//     }
//   };
  
  // Get Route (GET /logs)
//   app.get("/logs", async (req, res) => {
//     try {
//       const logs = await Log.find(); // Fetch all logs
//       res.status(200).json(logs);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching logs", error });
//     }
//   });
  
const GetDeviceLogs = async (req, res) => {
  const { deviceName, date } = req.query;

  try {
      if (!deviceName || !date) {
          return res.status(400).json({ message: "deviceName and date are required" });
      }

      // Construct query to filter logs for the given device and date
      const query = {
          deviceName,
          date
      };

  
      const logs = await Log.find(query)
          .sort({ time: 1 }) // Sorting by time in ascending order
          .select("deviceName latitude longitude date time");

      res.status(200).json(logs);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching logs", error });
  }
};

  const GetRealtime =async(req,res)=>{
  
    const deviceName = req.params.deviceName;
  
    const result = await Realtime.findOne({deviceName:deviceName})
  
  
    res.send(result)
  }
  

  module.exports = {DeviceLogs,DeviceRealTime,GetDeviceLogs,GetRealtime,addDeviceRealtime}