import { collection, addDoc, getFirestore, serverTimestamp } from "firebase/firestore";
import { auth } from "../config/firebase";

const db = getFirestore();

export const sendMessage = async (text: string) => {
  try {
    await addDoc(collection(db, "anonymousMessages"), {
      text,
      timestamp: serverTimestamp(), // Adds message creation time
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Function to send an anonymous message
export const sendAnonymousMessage = async (messageText: string) => {
    if (!auth.currentUser) return;
  
    try {
      await addDoc(collection(db, "anonymousMessages"), {
        text: messageText,
        senderId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
        anonymous: true,
      });
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  };
