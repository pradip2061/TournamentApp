import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../NavigationRef"; // Import global navigation function

const TokenCheck = () => {
  useEffect(() => {
    const checkTokenExpiration = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const expiryTime = await AsyncStorage.getItem("tokenExpiry");

        if (token && expiryTime) {
          if (Date.now() > Number(expiryTime)) {
            // Token expired, remove it & navigate to login
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("tokenExpiry");
            console.log("Token expired! Logging out...");
            navigate("Authenticate"); // Navigate to Authenticate screen
          }
        }
      } catch (error) {
        console.log("Error checking token:", error);
      }
    };

    const interval = setInterval(checkTokenExpiration, 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default TokenCheck;
