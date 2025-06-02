import { collection, addDoc, getDocs, getFirestore, serverTimestamp } from "firebase/firestore";
import { auth } from "../config/firebase";

const db = getFirestore();

// Function to send a reply
export const sendReply = async (messageId: string, replyText: string) => {
  if (!auth.currentUser) return;

  try {
    await addDoc(collection(db, `anonymousMessages/${messageId}/replies`), {
      text: replyText,
      senderId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error sending reply:", error);
    return false;
  }
};

// Function to fetch replies for a message
export const getReplies = async (messageId: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, `anonymousMessages/${messageId}/replies`));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching replies:", error);
    return [];
  }
};
