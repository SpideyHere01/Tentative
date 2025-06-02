import React, { useEffect, useState, useRef } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { sendMessage } from "../services/dms";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../config/firebase";

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp?: any; // Can be null at first
}

const ChatScreen = ({ route }: any) => {
  const { conversationId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const q = query(
      collection(db, `conversations/${conversationId}/messages`),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
          senderId: doc.data().senderId,
          timestamp: doc.data().timestamp || null, // Ensure timestamp doesn't crash
        }))
      );
      setLoading(false);
      flatListRef.current?.scrollToEnd({ animated: true });
    });

    return () => unsubscribe();
  }, [conversationId]);

  const handleSend = async () => {
    if (!messageText.trim() || sending || !auth.currentUser) return;

    setSending(true);
    try {
      await sendMessage(conversationId, auth.currentUser.uid, messageText);
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.senderId === auth.currentUser?.uid ? styles.myMessage : styles.theirMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
              {item.timestamp
                ? new Date(item.timestamp.toDate()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
                : "Sending..."}
            </Text>
          </View>
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input for sending messages */}
      <View style={styles.inputContainer}>
        <TextInput
          label="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          style={styles.input}
          disabled={sending}
        />
        <Button
          mode="contained"
          onPress={handleSend}
          loading={sending}
          disabled={sending || !messageText.trim()}
        >
          Send
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#F5F5F5" },
  centered: { justifyContent: "center", alignItems: "center" },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    marginVertical: 4,
    borderRadius: 12,
  },
  myMessage: { 
    alignSelf: "flex-end", 
    backgroundColor: "#007AFF", 
    padding: 10, 
    borderTopRightRadius: 0 
  },
  theirMessage: { 
    alignSelf: "flex-start", 
    backgroundColor: "#E5E5EA", 
    padding: 10, 
    borderTopLeftRadius: 0 
  },
  messageText: { fontSize: 16, color: "#000" },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#FFF" },
  input: { flex: 1, marginRight: 10 },
  timestamp: { fontSize: 12, color: "#666", marginTop: 4, alignSelf: "flex-end" },
});

export default ChatScreen;
