import React from "react";
import { View, StyleSheet } from "react-native";
import SwipeCard from "../components/SwipeCard";
import { Text } from "react-native-paper";

const SwipeFeedScreen = ({ navigation }: any) => {
  const handleSwipeRight = (message: any) => {
    navigation.navigate("ReplyScreen", { message });
  };

  const handleSwipeLeft = (message: any) => {
    console.log("Skipped message:", message.text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Swipe Messages</Text>
      <SwipeCard onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8F9FB" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
});

export default SwipeFeedScreen;
