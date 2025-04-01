const User = require("../../DB/models/User");

const getUserProfile = async (req, res) => {
 
    const { custommerId } = req.user;

  try {
    const user = await User.findOne({ custommerId }).select(
      "-isAdmin -__v -device -_id -custommerIdVersions"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while retrieving user details.",
        error,
      });
  }
};

const UpdateUserProfile = async (req, res) => {
  const { custommerId }= req.user;
  const updates = req.body;

  // Restrict updates to exclude certain fields
  const restrictedFields = ["custommerId", "device", "isAdmin", "__v"];
  const filteredUpdates = Object.keys(updates)
    .filter((key) => !restrictedFields.includes(key)) // Exclude restricted fields
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});

  try {
    const user = await User.findOneAndUpdate(
      { custommerId },
      { $set: filteredUpdates }, // Only apply filtered updates
      { new: true, fields: "-isAdmin -__v -device -custommerId" } // Exclude these fields in response
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User details updated successfully.",
      user  });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while updating user details.",
        error,
      });
  }
};

const VerifiPasword = async (req, res) => {
  const { custommerId } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password must be provided." });
  }

  try {
    const user = await User.findOne({ custommerId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = user.password === password;

    res.status(200).json({ matched: isMatch });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while verifying the password.",
        error,
      });
  }
};

module.exports = { VerifiPasword, UpdateUserProfile, getUserProfile };
