import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { PanGestureHandler, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler, runOnJS } from "react-native-reanimated";
import { collection, getDocs, getFirestore, query, orderBy, limit, startAfter } from "firebase/firestore";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.3; // More sensitive swipes
const ROTATION_FACTOR = 8; // Makes swipe rotation smoother
const FETCH_LIMIT = 10; // Number of messages to fetch at a time

const db = getFirestore();

const SwipeCard = ({ onSwipeLeft, onSwipeRight }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const fetchMessages = async (isInitial = false) => {
    if (isLoading || !hasMoreMessages) return;

    try {
      setIsLoading(true);
      let q;

      if (isInitial || !lastDoc) {
        q = query(collection(db, "anonymousMessages"), orderBy("timestamp", "desc"), limit(FETCH_LIMIT));
      } else {
        q = query(collection(db, "anonymousMessages"), orderBy("timestamp", "desc"), startAfter(lastDoc), limit(FETCH_LIMIT));
      }

      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;

      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (fetchedMessages.length === 0) {
        setHasMoreMessages(false);
      } else {
        setLastDoc(lastVisible);
        setMessages((prev) => (isInitial ? fetchedMessages : [...prev, ...fetchedMessages]));
        if (isInitial) setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(true);
  }, []);

  useEffect(() => {
    if (currentIndex >= messages.length - 3 && hasMoreMessages && !isLoading) {
      fetchMessages(false);
    }
  }, [currentIndex]);

  const moveToNextMessage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1 < messages.length ? prevIndex + 1 : prevIndex));
  };

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      rotate.value = (event.translationX / width) * ROTATION_FACTOR;
    },
    onEnd: (event) => {
      if (messages.length === 0 || currentIndex >= messages.length) {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
        return;
      }

      if (event.translationX > SWIPE_THRESHOLD) {
        runOnJS(onSwipeRight)(messages[currentIndex]);
        runOnJS(moveToNextMessage)();
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        runOnJS(onSwipeLeft)(messages[currentIndex]);
        runOnJS(moveToNextMessage)();
      }

      translateX.value = withSpring(0);
      rotate.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      {messages.length > 0 && currentIndex < messages.length ? (
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={styles.messageText}>{messages[currentIndex].text}</Text>
          </Animated.View>
        </PanGestureHandler>
      ) : isLoading ? (
        <ActivityIndicator size="large" color="#6200EE" />
      ) : (
        <Text style={styles.noMessages}>No more messages</Text>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: width * 0.85,
    height: 450,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  messageText: { fontSize: 20, fontWeight: "600", textAlign: "center", color: "#333" },
  noMessages: { fontSize: 18, color: "gray" },
});

export default SwipeCard;
