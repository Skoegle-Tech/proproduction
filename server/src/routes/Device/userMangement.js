const User = require("../../DB/models/User")



const GetAllUsersForAdmin = async (req, res) => {
    const { custommerId } = req.user;
console.log(custommerId)
    try {
      // Regex to match the custommerId and its variations
      const regex = new RegExp(`^${custommerId}(_\\d+)?$`);
      const customers = await User.find({ custommerId: { $regex: regex } });
  
      if (customers.length === 0) {
        return res.status(404).json({ message: "No customers found for the given custommerId." });
      }
  
      res.status(200).json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }




  const DeleteuserforAdmin = async (req, res) => {
    const { custommerId } = req.params;
    try {
      const deletedCustomer = await User.findOneAndDelete({ custommerId });
  
      if (!deletedCustomer) {
        return res.status(404).json({ message: "No customer found with the given custommerId." });
      }
  
      res.status(200).json({
        message: "Customer successfully deleted.",
        deletedCustomer,
      });
    } catch (error) {
      console.error("Error deleting customer:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }


  module.exports = {DeleteuserforAdmin,GetAllUsersForAdmin}