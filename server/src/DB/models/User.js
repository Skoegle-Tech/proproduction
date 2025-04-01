const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  device: { type: Array, default: [] },
  isAdmin: { type: Boolean, default: false },
  custommerId: { type: String },  // This field will store the most recent custommerId
  custommerIdVersions: { type: [String], default: [] } // Array to store all custommerId versions like "CUST-123_1"
});

const User = mongoose.model("DraftUser", userSchema);

module.exports = User;
  