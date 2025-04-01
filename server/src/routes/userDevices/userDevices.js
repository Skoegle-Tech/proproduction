const User = require("../../DB/models/User");

const addUserDevices = async (req, res) => {
    const { custommerId } = req.params;
    const { devices } = req.body;

    if (!devices || !Array.isArray(devices)) {
        return res
            .status(400)
            .json({ message: "Devices must be provided as an array." });
    }

    try {
        const user = await User.findOne({ custommerId });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const existingDevices = user.device.filter((device) =>
            devices.includes(device)
        );

        const newDevices = devices.filter((device) => !user.device.includes(device));

        if (newDevices.length > 0) {
            user.device.push(...newDevices);
            await user.save();
        }

        const response = {
            message: "Device processing completed.",
            devicesStatus: devices.map((device) => {
                if (existingDevices.includes(device)) {
                    return { device, status: "Device is already added." };
                } else {
                    return { device, status: "Device added successfully." };
                }
            }),
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while adding devices.",
            error,
        });
    }
};

const getDevices = async (req, res) => {
    const { custommerId } =  req.user;

    try {
        const user = await User.findOne({ custommerId });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ devices: user.device });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "An error occurred while retrieving devices.", error });
    }
};

const deleteDevices = async (req, res) => {
    const { custommerId } = req.params;
    const { devices } = req.body;

    if (!devices || !Array.isArray(devices)) {
        return res
            .status(400)
            .json({ message: "Devices must be provided as an array." });
    }

    try {
        const user = await User.findOne({ custommerId });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.device = user.device.filter((device) => !devices.includes(device));

        await user.save();

        res.status(200).json({ message: "Devices deleted successfully.", devices: user.device });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "An error occurred while deleting devices.", error });
    }
};

module.exports = { getDevices, addUserDevices, deleteDevices };
