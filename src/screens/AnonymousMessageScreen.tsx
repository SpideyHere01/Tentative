import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { sendAnonymousMessage } from "../services/messages";

const AnonymousMessageScreen = ({ navigation }: any) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert("Please enter a message.");
      return;
    }

    setLoading(true);
    const success = await sendAnonymousMessage(message);
    setLoading(false);

    if (success) {
      alert("Message sent anonymously!");
      setMessage("");
      navigation.goBack(); // Go back to the previous screen
    } else {
      alert("Failed to send message. Try again.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <Card style={styles.card}>
        <Text variant="headlineMedium" style={styles.title}>
          Send an Anonymous Message
        </Text>
        <TextInput
          label="Write your message..."
          value={message}
          onChangeText={setMessage}
          multiline
          style={styles.input}
          mode="outlined"
          theme={{ roundness: 10 }}
        />
        <Button mode="contained" onPress={handleSendMessage} loading={loading} style={styles.button}>
          Send
        </Button>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#F8F9FB" },
  card: { width: "100%", padding: 20, borderRadius: 15, backgroundColor: "#FFFFFF", elevation: 4 },
  title: { textAlign: "center", marginBottom: 15, fontWeight: "bold", color: "#333" },
  input: { width: "100%", marginBottom: 15, backgroundColor: "#FFF" },
  button: { borderRadius: 10, marginTop: 10 },
});

export default AnonymousMessageScreen;
