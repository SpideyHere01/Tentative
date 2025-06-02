import { collection, addDoc, getDocs, query, where, getFirestore, serverTimestamp } from "firebase/firestore";
import { auth } from "../config/firebase";

const db = getFirestore();

// Function to create/find a conversation between two users
export const getOrCreateConversation = async (userId: string) => {
  if (!auth.currentUser) return null;

  try {
    // Check if a conversation already exists
    const q = query(collection(db, "conversations"), where("users", "array-contains", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    const existingChat = querySnapshot.docs.find((doc) => doc.data().users.includes(userId));
    if (existingChat) return existingChat.id;

    // If not found, create a new conversation
    const docRef = await addDoc(collection(db, "conversations"), {
      users: [auth.currentUser.uid, userId],
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating conversation:", error);
    return null;
  }
};

// Function to send a message
export const sendMessage = async (conversationId: string, text: string) => {
  if (!auth.currentUser) return;

  try {
    await addDoc(collection(db, `conversations/${conversationId}/messages`), {
      senderId: auth.currentUser.uid,
      text,
      timestamp: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
};
