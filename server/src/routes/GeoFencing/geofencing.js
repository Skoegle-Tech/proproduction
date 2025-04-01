const GeoFencing = require("../../DB/models/GeoFencing");

const CreateGeoFencing= async (req, res) => {
    const { deviceName, latitude, longitude } = req.body;
    const {custommerId:customerId} = req.user 


const findDevice = await GeoFencing.findOne({ deviceName });
if (findDevice) {
    return res.status(400).send({ message: `GeoFencing already exists for Divice ${findDevice?.deviceName}` });
}

    const geoFencing = new GeoFencing({ customerId, deviceName, latitude, longitude });
    try {
        await geoFencing.save();
        res.status(201).send(geoFencing);
    } catch (error) {
        res.status(400).send(error);
    }
};


const GetGeoFencing= async (req, res) => {

    const { deviceName } = req.params;
console.log(deviceName)
    try {
        const geoFencings = await GeoFencing.findOne({ deviceName });
        res.status(200).send(geoFencings);
    } catch (error) {
        res.status(500).send(error);
    }
};



const SetGeofencing = async (req, res) => {
    const { deviceName ,radius} = req.params;
    console.log(deviceName,radius)
    try {
        const geoFencing = await GeoFencing.findOneAndUpdate({
            deviceName
        },{radius}, { new: true, runValidators: true });

        res.send({radius:geoFencing.radius});
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error setting geofencing", error });
    }}

const UpdateGeoFencing = async (req, res) => {
    const { deviceName } = req.params;
    const { latitude, longitude } = req.body;
console
    try {
        const geoFencing = await GeoFencing.findOneAndUpdate(
            { deviceName }, // Query object
            { latitude, longitude }, 
            { new: true, runValidators: true }
        );

        if (!geoFencing) {
            return res.status(404).json({ message: "Geofencing entry not found" });
        }

        res.status(200).json({ message: "Geofencing updated successfully", geoFencing });
    } catch (error) {
        res.status(400).json({ message: "Error updating geofencing", error });
    }
};


const SetRadius =  async (req, res) => {
    const { deviceName } = req.params;
    const {radius } = req.body;
      console.log(radius)
   const geoFencing = await GeoFencing.findOneAndUpdate({ deviceName }, { radius }, { new: true });
   res.send(geoFencing)       
} 


const DeleteGeoFencing= async (req, res) => {
    const { deviceName } = req.params;
    try {
        const geoFencing = await GeoFencing.findOneAndDelete({ deviceName });
        if (!geoFencing) {
            return res.status(404).send();
        }
        res.status(200).send(geoFencing);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports={CreateGeoFencing,GetGeoFencing,UpdateGeoFencing,DeleteGeoFencing,SetGeofencing}