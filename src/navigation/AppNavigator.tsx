import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import AnonymousMessageScreen from "../screens/AnonymousMessageScreen";
import SwipeFeedScreen from "../screens/SwipeFeedScreen";
import ReplyScreen from "../screens/ReplyScreen";
import ChatScreen from "../screens/ChatScreen";
import MessagesScreen from "../screens/MessagesScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Hide headers only for login/signup screens */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AnonymousMessage" component={AnonymousMessageScreen} />
        <Stack.Screen name="SwipeFeed" component={SwipeFeedScreen} />
        <Stack.Screen name="ReplyScreen" component={ReplyScreen} />
        
        {/* Enable headers for better navigation */}
        <Stack.Screen name="Messages" component={MessagesScreen} options={{ title: "Messages" }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: "Chat" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
