import { collection, getFirestore, deleteDoc, doc, query, where, getDocs, writeBatch } from "firebase/firestore";

const db = getFirestore();

// Function to delete messages older than 24 hours
export const deleteExpiredMessages = async () => {
  try {
    const now = Date.now();
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000); // 24 hours ago

    // Query to get only expired messages (older than 24 hours)
    const messagesQuery = query(
      collection(db, "anonymousMessages"),
      where("timestamp", "<=", twentyFourHoursAgo)
    );

    const querySnapshot = await getDocs(messagesQuery);

    if (querySnapshot.empty) {
      console.log("No expired messages found.");
      return;
    }

    // Use batch deletes for better performance
    const batch = writeBatch(db);

    querySnapshot.forEach((message) => {
      batch.delete(doc(db, "anonymousMessages", message.id));
      console.log(`Queued for deletion: ${message.id}`);
    });

    // Commit all deletions in one request
    await batch.commit();
    console.log("Expired messages deleted successfully.");

  } catch (error) {
    console.error("Error deleting expired messages:", error);
  }
};
