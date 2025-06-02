import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { Button, Text } from "react-native-paper";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

// ✅ Corrected Image Path (Ensure background.png is inside src/assets/)
const backgroundImage = require("../assets/background.png");

const HomeScreen = ({ navigation }: any) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text variant="headlineLarge" style={styles.title}>
          Welcome to Tenta
        </Text>

        <Button mode="contained" onPress={() => navigation.navigate("AnonymousMessage")} style={styles.button}>
          Send Anonymous Message
        </Button>

        <Button mode="contained" onPress={() => navigation.navigate("SwipeFeed")} style={styles.button}>
          Open Swipe Feed
        </Button>

        <Button mode="contained" onPress={() => navigation.navigate("Messages")} style={styles.button}>
          Open Messages (DMs)
        </Button>

        <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
          Logout
        </Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Slightly darker overlay
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    width: "90%",
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 5,
    backgroundColor: "#6C63FF",
  },
  logoutButton: {
    width: "90%",
    borderRadius: 10,
    marginTop: 20,
    borderColor: "#fff",
  },
});

export default HomeScreen;
