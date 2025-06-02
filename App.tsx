import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LogBox } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { deleteExpiredMessages } from "./src/services/messageCleanup"; // Import cleanup function

export default function App() {
  useEffect(() => {
    // Run deleteExpiredMessages every 1 hour
    const interval = setInterval(() => {
      deleteExpiredMessages();
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
