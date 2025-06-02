import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text, Card, Divider } from "react-native-paper";
import { sendReply, getReplies } from "../services/replies";

const ReplyScreen = ({ route, navigation }: any) => {
  const { message } = route.params;
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch replies when the screen loads
  useEffect(() => {
    const loadReplies = async () => {
      setLoading(true);
      const fetchedReplies = await getReplies(message.id);
      setReplies(fetchedReplies);
      setLoading(false);
    };
    loadReplies();
  }, []);

  const handleSendReply = async () => {
    if (!reply.trim()) {
      alert("Please enter a reply.");
      return;
    }

    const success = await sendReply(message.id, reply);
    if (success) {
      setReplies((prev) => [...prev, { text: reply, senderId: "You", timestamp: new Date().toISOString() }]);
      setReply("");
    } else {
      alert("Failed to send reply.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <Card style={styles.card}>
        <Text variant="titleMedium" style={styles.title}>Anonymous Message</Text>
        <Text style={styles.messageText}>{message.text}</Text>
        <Divider style={styles.divider} />

        <FlatList
          data={replies}
          keyExtractor={(item) => item.id || `reply-${Math.random().toString()}`}
          renderItem={({ item }) => (
            <Card style={[styles.replyCard, item.senderId === "You" ? styles.myReply : styles.otherReply]}>
              <Card.Content>
                <Text style={styles.replyText}>{item.text}</Text>
                <Text style={styles.timestamp}>
                  {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"}
                </Text>
              </Card.Content>
            </Card>
          )}
          contentContainerStyle={styles.repliesList}
        />

        <TextInput
          label="Write a reply..."
          value={reply}
          onChangeText={setReply}
          multiline
          style={styles.input}
          mode="outlined"
          theme={{ roundness: 12 }}
        />

        <Button mode="contained" onPress={handleSendReply} style={styles.button} loading={loading} disabled={loading || !reply.trim()}>
          Send Reply
        </Button>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#FAFAFC" },
  card: { width: "100%", padding: 20, borderRadius: 15, backgroundColor: "#FFFFFF", elevation: 4 },
  title: { textAlign: "center", fontWeight: "600", color: "#333", marginBottom: 10 },
  messageText: { fontSize: 16, textAlign: "center", marginBottom: 10, color: "#555" },
  divider: { marginVertical: 10 },
  repliesList: { width: "100%", paddingBottom: 10 },
  replyCard: { marginVertical: 5, padding: 10, borderRadius: 12 },
  myReply: { backgroundColor: "#DCEEFF", alignSelf: "flex-end" },
  otherReply: { backgroundColor: "#F0F0F0", alignSelf: "flex-start" },
  replyText: { fontSize: 15, color: "#333" },
  input: { width: "100%", marginBottom: 10, backgroundColor: "#FFF" },
  button: { borderRadius: 12, marginTop: 10 },
  timestamp: { fontSize: 12, color: "#888", marginTop: 4, textAlign: "right" },
});

export default ReplyScreen;
