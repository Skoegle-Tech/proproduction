const { getlocation,testvidios} = require("../../DB/models/Dmarg");




const GetLocation= async (req, res) => {
    try {
      const { deviceName, latitude, longitude, date, fromTime, toTime } = req.body;
  
      // Validate data (you can also use a schema validation in Mongoose for this)
      if (!deviceName || !latitude || !longitude || !date || !fromTime || !toTime) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Create a new location record
      const newLocation = new getlocation({
        deviceName,
        latitude,
        longitude,
        date,
        fromTime,
        toTime
      });
  
      // Save the record to the database
      await newLocation.save();
  
      // Respond with success message and the saved data
      res.status(201).json({
        message: 'Location record created successfully',
        data: newLocation
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error while creating the location' });
    }
  };
  
// **POST /create**
const PushVidios= async (req, res) => {
    try {
        const { url, filename, deviceName, date, fromtime, totime } = req.body;

        if (!url || !filename) {
            return res.status(400).json({ message: "url and filename are required" });
        }

        const newRecord = await testvidios.create({ url, filename, deviceName, date, fromtime, totime });
        res.status(201).json({ message: "Record added successfully", data: newRecord });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// **GET /find**
const FilterVidios = async (req, res) => {
    try {
        const { fromdate, todate, fromtime, totime, deviceName } = req.query;

        if (!fromdate || !todate) {
            return res.status(400).json({ message: "Both fromdate and todate are required" });
        }

     
        const query = { date: { $gte: fromdate, $lte: todate } };

        if (fromtime && totime) {
    

            query.$and = [
                { fromtime: { $gte: fromtime } },
                { totime: { $lte: totime } }
            ];
        }

        if (deviceName) {
            query.deviceName = deviceName;
        }

        const result = await testvidios.find(query);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}






// **GET /check-live**
const CheckLive = async (req, res) => {
    try {
        const { fromdate, todate, fromtime, totime, deviceName } = req.query;

        const query = { date: { $gte: fromdate, $lte: todate } };
        if (fromtime && totime) {
            query.$and = [{ fromtime: { $gte: fromtime } }, { totime: { $lte: totime } }];
        }
        if (deviceName) {
            query.deviceName = deviceName;
        }

        const result = await testvidios.find(query);
        res.send({ isLive: result.length > 0, urls: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    GetLocation,
    PushVidios,
    FilterVidios,
    CheckLive
}