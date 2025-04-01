import { useEffect } from "react";

const CrashAlert = () => {
  useEffect(() => {
    const handleCrash = () => {
      while (true) {
        alert("App has crashed due to over graphics and token is not accessible.");
      }
    };

    handleCrash();
  }, []);

  return null; // No UI needed since it just alerts in a loop
};

export default CrashAlert;
