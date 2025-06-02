# Tenta

Tenta is a cross-platform mobile app built with React Native and Expo, enabling users to send and receive anonymous messages, reply to messages, and chat via direct messages (DMs). The app uses Firebase for authentication and real-time data storage.

## Features

- **Anonymous Messaging:** Send and receive anonymous messages.
- **Swipe Feed:** Browse anonymous messages in a swipeable card interface.
- **Reply to Messages:** Reply to anonymous messages and view replies.
- **Direct Messages (DMs):** Start and participate in private conversations with other users.
- **Authentication:** Sign up and log in with email and password using Firebase Auth.
- **Automatic Cleanup:** Messages older than 24 hours are automatically deleted.
- **Cross-Platform:** Runs on Android, iOS, and web (via Expo).

## Screenshots
<!-- Add screenshots of your app here if available -->

## Getting Started

### Prerequisites
- Node.js (v16 or later recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Tentative
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Authentication (Email/Password) and Firestore Database.
   - Add your Firebase config to `src/config/firebase.ts` (file not included in repo for security).

4. Start the app:
   ```bash
   npm start
   # or
   yarn start
   ```
   - Use the Expo Go app on your phone, or run on an emulator/simulator.

## Project Structure

```
Tentative/
├── assets/                # App assets (icons, images)
├── src/
│   ├── components/        # Reusable UI components
│   ├── config/            # Firebase configuration
│   ├── navigation/        # App navigation (React Navigation)
│   ├── screens/           # App screens (Home, Login, Signup, etc.)
│   ├── services/          # Firebase and business logic (messages, DMs, replies)
│   └── types/             # TypeScript types
├── App.tsx                # App entry point
├── app.json               # Expo configuration
├── package.json           # Project metadata and scripts
├── tsconfig.json          # TypeScript configuration
└── firestore.rules        # Firestore security rules
```

## Scripts
- `npm start` / `yarn start`: Start the Expo development server
- `npm run android` / `yarn android`: Run on Android device/emulator
- `npm run ios` / `yarn ios`: Run on iOS simulator
- `npm run web` / `yarn web`: Run in web browser

## Tech Stack
- **React Native** (with Expo)
- **TypeScript**
- **Firebase** (Auth, Firestore)
- **React Navigation**
- **react-native-paper** (UI components)
- **react-native-reanimated**, **react-native-gesture-handler** (animations & gestures)

## Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if true;
      match /replies/{replyId} {
        allow read: if true;
        allow create: if true;
      }
    }
  }
}
```

## Notes
- Make sure to add your own `firebase.ts` config file in `src/config/`.
- Anonymous messages are deleted after 24 hours by a background cleanup process.
- This project is for educational/demo purposes. For production, review and tighten security rules.

## License
MIT 