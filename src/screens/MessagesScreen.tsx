import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { List, Text } from "react-native-paper";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const MessagesScreen = ({ navigation }: any) => {
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Listen for real-time updates to conversations
    const q = query(collection(db, "conversations"), where("users", "array-contains", auth.currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedConversations = snapshot.docs.map((doc) => ({
        id: doc.id,
        users: doc.data().users.filter((id: string) => id !== auth.currentUser?.uid), // Show the other user's ID
      }));

      setConversations(fetchedConversations);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Messages</Text>

      {conversations.length === 0 ? (
        <Text style={styles.noMessagesText}>No conversations yet.</Text>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={`Chat with User ${item.users[0]}`} // Still showing user ID
              description="Tap to open chat"
              style={styles.chatItem}
              onPress={() => navigation.navigate("Chat", { conversationId: item.id })}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { marginBottom: 20, textAlign: "center", fontSize: 22, fontWeight: "bold" },
  noMessagesText: { textAlign: "center", fontSize: 16, color: "gray", marginTop: 20 },
  chatItem: { backgroundColor: "#f2f2f2", padding: 10, marginVertical: 5, borderRadius: 10 },
});

export default MessagesScreen;
