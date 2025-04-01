const InitializeSmtpConnection = require("smtp-package");
const { sendCustomMessageByEmail } = InitializeSmtpConnection(process.env.SMTP_PROVIDER, process.env.SMTP_PROVIDER_API_KEY);
const findUsersByDeviceName = require("./GetUserDetails");

async function Alert(device, geofencingstatus, distance, latitude, longitude) {
  console.log(device, geofencingstatus, distance, latitude, longitude);
  

  const userData = await findUsersByDeviceName(device);


  const currentDateTime = new Date().toISOString().replace('T', ' ').substr(0, 19);
  
  const googleMapsLink = `https://www.google.com/maps/place/${latitude},${longitude}`;

 
  if (userData && userData.length > 0) {
    for (const user of userData) {
      if (user.userDetails && user.userDetails.email) {
        try {
          const firstName = user.userDetails.firstName || '';
          const lastName = user.userDetails.lastName || '';
          const emailMessage = `Hi ${firstName} ${lastName},

Your tracking device has moved ${geofencingstatus} the ${distance} km range!

Current device location: ${googleMapsLink}

Alert Time (UTC): ${currentDateTime}

You can track your device in real-time by clicking on the link above.`;
          
          await sendCustomMessageByEmail(
            user.userDetails.email,
            "Geofencing Alert",
            emailMessage
          );
          console.log(`Alert email sent to ${user.userDetails.email}`);
        } catch (error) {
          console.error(`Failed to send email to ${user.userDetails.email}:`, error);
        }
      }
    }
  } else {
    console.log(`No users found for device: ${device}`);
  }
}

module.exports = Alert;