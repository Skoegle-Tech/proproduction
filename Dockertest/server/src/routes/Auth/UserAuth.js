const User = require("../../DB/models/User");
const DeviceToken = require("../../DB/models/DeviceToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const InitializeSmtpConnection = require("smtp-package");
const { sendCustomMessageByEmail } = InitializeSmtpConnection(process.env.SMTP_PROVIDER, process.env.SMTP_PROVIDER_API_KEY);
const {ncrypt } = require("ncrypt-js")

const { encrypt, decrypt } = new ncrypt(process.env.JWT_SEC);

const Login = async (req, res) => {
  try {
    const { email, password,devicedetails } = req.body;

    if(!email || !password||!devicedetails){
      return res.send({message:"email and  paswword are required",valid:false})
    }



    let user = await User.findOne({ email });
    if (!user) {
      return res.send({ message: "Please create an account", valid: false });
    }

    if (user.password !== password) {
      return res.send({ message: "Incorrect email or password", valid: false });
    }

    const deviceString = `DV-${crypto.randomInt(1000000, 9999999)}`;
    const newDevice = new DeviceToken({
      custommerId: user.custommerId,
      deviceString,
      devicedetails:JSON.stringify(devicedetails),
      email:user.email
    });

    await newDevice.save();

    const token = jwt.sign(
      { custommerId: user.custommerId, deviceString },
      process.env.JWT_SEC,
      { expiresIn: "10d" }
    );
// console.log(token)
    // const isProduction = process.env.NODE_ENV === "production";
    // res.cookie("auth_token", token, {
    //   httpOnly: true,
    //   secure: isProduction,
    //   maxAge: 2 * 60 * 60 * 1000,
    //   sameSite: isProduction ? "Strict" : "Lax",
    // });

    res.status(200).send({ message: "Login successful", valid: true, token ,isAdmin:user.isAdmin,custommerId:user?.custommerId});
  } catch (error) {
    console.error("Error in Login:", error);
    res
      .status(500)
      .send({ message: "An error occurred during login", valid: false });
  }
};
const SignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, custommerId } =
      req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.send({ message: "User already exists", valid: false });
    }

    // Generate or check for an existing custommerId
    let generatedCustomerId = custommerId || `CUST-${crypto.randomInt(100000000, 999999999)}`;
    
    // Check if custommerId already exists in the collection
    const existingUser = await User.findOne({ custommerId });
    
    // If custommerId exists, increment the number
    if (existingUser) {
      let versionNumber = 1;
      let newCustommerId = `${generatedCustomerId}_${versionNumber}`;
      
      // Keep checking until we find a unique version
      while (await User.findOne({ custommerId: newCustommerId })) {
        versionNumber++;
        newCustommerId = `${generatedCustomerId}_${versionNumber}`;
      }
      
      // Set the generated custommerId
      generatedCustomerId = newCustommerId;
    }
    
    // Create the new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      custommerId: generatedCustomerId,
      custommerIdVersions: [generatedCustomerId], // Add the first version
    });

    await newUser.save();
    res.send({
      message: `User registered successfully with Email ${newUser?.email} and CustommerId ${newUser?.custommerId}`,
      valid: true,
    });
  } catch (error) {
    console.error("Error in SignUp:", error);
    res.status(500).send({ message: "An error occurred during signup", valid: false });
  }
};
    
const verifyJWTAndDevice = async (req, res) => {

  const authHeader = req.headers.authorization; 
  const token = authHeader.split(" ")[1] || req?.query?.token;
  try {
    if (!token) {
      return res
        .status(401)
        .send({ message: "Unauthorized: No token provided", valid: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const { custommerId, deviceString } = decoded;

    const validDevice = await DeviceToken.findOne({
      custommerId,
      deviceString,
    });
    const userdata = await User.findOne({custommerId})
    if (!validDevice) {
      res.clearCookie("auth_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      });
      return res
        .status(401)
        .send({ message: "Unauthorized: Invalid device", valid: false});
    }

    res.send({ message: "User and device verified", valid: true ,isAdmin:userdata?.isAdmin });
  } catch (error) {
    console.error("Error in JWT or device verification:", error);
    res
      .status(401)
      .send({ message: "Unauthorized: Invalid token or device", valid: false });
  }
};

const logout = async (req, res) => {
  try {
    const { custommerId, deviceString } = req.user;


    const deletedDevice = await DeviceToken.findOneAndDelete({
      custommerId,
      deviceString,
    });
    if (!deletedDevice) {
      return res.status(404).send({
        message: "Device not found or already logged out",
        valid: false,
      });
    }


    res.status(200).send({ message: "Logout successful", valid: true });
  } catch (error) {
    console.error("Error during logout:", error);
    res
      .status(500)
      .send({ message: "An error occurred during logout", valid: false });
  }
};


const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).send({ message: "User not found", valid: false });
    }
    const token = jwt.sign(
      { custommerId: user?.custommerId },
      process.env.JWT_SEC,
      { expiresIn: "1h" }
    );
    const encryptedtoken = encrypt(token);
    // const resetLink = `${process.env.CLIENT_URL}/resetpassword/${encryptedtoken}`;
    const resetLink = `http://localhost:5001/resetpassword/${encryptedtoken}`;
    const message = `
Hello,

We received a request to reset your password.

To create a new password, please use the link below:
${resetLink}
If you didn't request this password reset, you can safely ignore this email.
This link will expire in 1 hour for security reasons.
    `;
    
    await sendCustomMessageByEmail(email, "Reset Your Password", message);
    
    res.send({ message: "Reset link has been sent to your email", valid: true ,token:encryptedtoken});
  }
  catch (error) {
    console.error("Error during password reset:", error);
    res
      .status(500)
      .send({ message: "An error occurred during password reset", valid: false });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decryptedToken = decrypt(token);
    const decoded = jwt.verify(decryptedToken, process.env.JWT_SEC);
    console.log(decoded)
    const user = await User.findOne({custommerId:decoded.custommerId});
    if(!user){
      return res.send({message:"User not found",valid:false})
    }

    await User.findOneAndUpdate({custommerId:decoded.custommerId},{password});
    res.send({message:"Password updated successfully",valid:true})
  }
  catch (error) {
    console.error("Error during logout:", error);
    res
      .status(500)
      .send({ message: "An error occurred during logout", valid: false });
  }
}

module.exports = { SignUp, Login, verifyJWTAndDevice, logout,ForgotPassword ,ResetPassword};
