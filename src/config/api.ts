import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase"; // Ensure correct path

export const addReply = async (postId: string, text: string, userId: string) => {
  try {
    const replyRef = collection(db, "posts", postId, "replies"); // Replies subcollection
    await addDoc(replyRef, {
      content: text,
      userId,
      createdAt: serverTimestamp(),
    });
    console.log("Reply added successfully!");
  } catch (error) {
    console.error("Error adding reply:", error);
  }
};
