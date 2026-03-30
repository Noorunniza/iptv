# IPTV Full Project Documentation

## 1. Project Overview

This repository contains a full-stack IPTV application composed of:

- **iptv**: React Native mobile/TV client
- **iptv-backend**: Node.js + Express + MongoDB backend

The system allows users to:
- Register and log in
- Browse IPTV channels from an external M3U playlist
- Search and stream live channels
- Save favorites in folders
- Manage profile details
- Reset passwords via email deep linking

---

## 2. Problem Statement

This project provides a simple IPTV experience with user-based personalization.

Instead of storing channel data locally:
- Channels are fetched from a remote M3U playlist.
- Backend handles authentication and user-specific data (favorites, profile).

---

## 3. Objectives

- Secure authentication system
- Smooth IPTV streaming experience
- Support mobile + TV navigation
- Favorites management with folders
- Profile update functionality
- Email-based password reset system

---

## 4. Features

### Frontend (React Native)
- User registration & login
- Forgot/reset password (deep linking)
- IPTV playlist parsing (M3U)
- Search with live filtering
- Channel streaming (video player)
- Fullscreen landscape playback
- Favorites with folders
- Profile management
- Settings & logout
- TV-friendly keyboard
- Help & support screen

### Backend (Node.js + Express)
- JWT authentication
- Password hashing (bcrypt)
- MongoDB database
- Protected routes
- Favorites persistence
- Password reset tokens (expiry-based)
- Email sending (Nodemailer + Gmail)
- Deep link redirect handling

---

## 5. Tech Stack

### Frontend
- **Framework**: React 19 / React Native 0.83.1
- **Navigation**: React Navigation
- **Storage**: AsyncStorage
- **Styling**: Styled Components
- **Media**: react-native-video
- **Utilities**: react-native-orientation-locker, react-native-toast-message

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (Mongoose)
- **Auth**: JSON Web Token (JWT), bcryptjs
- **Mail**: Nodemailer
- **Environment**: dotenv

---

## 6. Project Structure

```text
ReactNativeApps/
├── README.md
├── iptv/
│   ├── App.tsx
│   ├── src/
│   │   ├── Navigation/
│   │   ├── components/
│   │   ├── config/
│   │   ├── context/
│   │   ├── screens/
│   │   ├── theme/
│   │   └── utils/
│   ├── android/
│   └── ios/
└── iptv-backend/
    ├── server.js
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── utils/
```

---

## 7. Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd iptv-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`.

---

## 8. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd iptv
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Metro Bundler:
   ```bash
   npm start
   ```
4. Run on Android:
   ```bash
   npm run android
   ```
5. Run on iOS (macOS only):
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```

---

## 9. Running the Full Project

Open two separate terminals:

**Terminal 1 (Backend):**
```bash
cd iptv-backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd iptv
npm start
# Then run:
npm run android
```

---

## 10. Important Notes

- **Network**: Replace `localhost` with your computer's local IP address when testing on real devices.
- **Database**: Ensure MongoDB is running locally or provide a cloud URI.
- **Deep Linking**: Configure deep linking properly in AndroidManifest/Info.plist for password resets.
- **Config**: Make sure the backend URL is correctly set in the frontend configuration.

---

## 11. Troubleshooting

### Metro Cache Issues
```bash
npx react-native start --reset-cache
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
```

### iOS Pods Issues
```bash
cd ios
pod install --repo-update
cd ..
```