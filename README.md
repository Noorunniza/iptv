# IPTV Full Project Documentation

## 1. Project Overview

This repository contains a full-stack IPTV application composed of:

- `iptv`: a React Native mobile/TV client
- `iptv-backend`: a Node.js + Express + MongoDB backend

The system allows users to create an account, sign in, browse IPTV channels from an external M3U playlist, search channels, stream live content, manage favorites, update profile details, and reset passwords through email-based recovery.

## 2. Problem Statement

The project is designed to provide a simple IPTV viewing experience with account-based personalization. Instead of storing channel metadata locally, the app consumes a remote M3U playlist, parses it into a channel list, and combines that live content source with a custom backend for authentication and favorites persistence.

## 3. Main Objectives

- Provide secure user registration and login
- Stream IPTV channels inside a React Native application
- Support both touch devices and TV-style navigation
- Let each user save favorite channels in named folders
- Allow users to update their account profile
- Provide a password reset flow using email and deep linking

## 4. Key Features

### Frontend

- User registration and login
- Forgot password and reset password flow
- IPTV channel loading from a remote M3U source
- Search screen with live filtering and highlight
- Channel detail screen with watch and favorite actions
- Video player with fullscreen landscape mode
- Favorites grouped into folders
- Account profile view and update
- Settings and logout flow
- TV-friendly on-screen keyboard for non-touch devices
- Help and support informational screen

### Backend

- JWT-based authentication
- Password hashing with bcrypt
- MongoDB user storage
- Protected profile and favorites routes
- Password reset token generation with expiration
- Gmail-based email delivery using Nodemailer
- Deep-link redirect endpoint for mobile password reset

## 5. Technology Stack

### Mobile App

- React 19
- React Native 0.83.1
- React Navigation
- AsyncStorage
- Styled Components
- react-native-video
- react-native-orientation-locker
- react-native-toast-message

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- Nodemailer
- dotenv

## 6. High-Level Architecture

```text
React Native App
    |
    |-- Auth requests ----------------------------> Express API
    |                                                |
    |                                                |-- MongoDB (users, favorites, reset tokens)
    |
    |-- Favorites sync ---------------------------> Express API
    |
    |-- Channel playlist fetch -------------------> Remote M3U URL
    |
    |-- Password reset link <--------------------- Email sent by backend
    |                                                |
    |-- Deep link open (iptv://reset-password) <---- Redirect endpoint
```

## 7. Repository Structure

```text
ReactNativeApps/
|-- README.md
|-- iptv/
|   |-- App.tsx
|   |-- src/
|   |   |-- Navigation/
|   |   |-- components/
|   |   |-- config/
|   |   |-- context/
|   |   |-- screens/
|   |   |-- theme/
|   |   |-- utils/
|   |-- android/
|   |-- ios/
|
|-- iptv-backend/
|   |-- server.js
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- .env.example
```

## 8. Frontend Documentation

### 8.1 Application Entry

`App.tsx` is the frontend entry point. It wraps the app with:

- `SafeAreaProvider`
- `FavoritesProvider`
- `ChannelProvider`
- global toast configuration

This means favorites state and channel data are accessible throughout the app.

### 8.2 Navigation Flow

The app uses a stack navigator with the following registered screens:

- `SignIn`
- `SignUp`
- `AddProfile`
- `Home`
- `Search`
- `Settings`
- `Channel`
- `Account`
- `Player`
- `Favorites`
- `HelpSupport`
- `ForgotPassword`
- `ResetPassword`
- `PasswordResetSuccess`

The initial route is `SignIn`.

Deep linking is configured for:

```text
iptv://reset-password/:token
```

This is used by the password reset flow.

### 8.3 Authentication Screens

#### Sign In

The sign-in screen:

- accepts email and password
- sends a `POST /api/auth/login` request
- stores the returned JWT in `AsyncStorage`
- loads favorites immediately after login
- redirects the user to `Home`

#### Sign Up

The sign-up screen:

- validates name, email, and password on the client
- sends a `POST /api/auth/register` request
- stores the JWT in `AsyncStorage`
- loads favorites
- resets navigation to `Home`

#### Forgot Password

The forgot-password screen:

- accepts an email
- calls `POST /api/auth/forgot-password`
- shows toast feedback
- relies on the backend to email the reset link

#### Reset Password

The reset-password screen:

- receives the token from the deep link route
- validates password and confirmation
- calls `POST /api/auth/reset-password/:token`
- redirects the user back to `SignIn` after success

### 8.4 Channel Loading and M3U Parsing

Channels are loaded from a remote M3U endpoint defined in:

- `iptv/src/config/m3u.js`

Current source:

```text
http://iptv.stampedecables.com/playlist/home12345/home12345/m3u
```

The app parses the playlist using `parseM3U`, which:

- reads `#EXTINF` metadata lines
- extracts channel names
- reads the following stream URL
- converts `https://` streams to `http://`

Channel loading happens in two places:

- `ChannelContext`, used by the search flow
- `Home` screen, which separately fetches channels for its own list

### 8.5 Home Screen

The home screen is the main content hub. It contains:

- sidebar navigation
- hero section
- channel grid populated from the parsed M3U playlist

Selecting a channel opens the `Channel` screen.

### 8.6 Search

The search system includes:

- search header input
- TV keyboard for large-screen interaction
- filtered results generated from `ChannelContext`
- highlighted matching text
- a favorite-state indicator

Selecting a result opens the `Channel` screen.

### 8.7 Channel and Player

#### Channel Screen

The channel screen displays:

- channel name
- watch button
- add-to-favorites action

From this screen, the user can:

- open the player
- add a channel into an existing or newly created favorites folder

#### Player Screen

The player screen streams the selected channel using `react-native-video`.

Supported behavior:

- inline controls
- fullscreen toggle
- orientation lock to landscape in fullscreen
- portrait restoration on exit

### 8.8 Favorites System

Favorites are managed by `FavoritesContext`.

Supported operations:

- load favorites from backend
- add a favorite channel
- remove a favorite channel
- group favorites by folder
- create a folder locally
- rename a folder locally
- delete a folder locally
- check whether a channel is already a favorite

Favorites are displayed in the `Favorites` screen using expandable folders.

### 8.9 Account Management

The `Account` screen:

- fetches the logged-in user's profile from `GET /api/users/me`
- displays name, email, and total favorite count
- allows profile update through `PUT /api/users/me`
- optionally updates password if provided

### 8.10 Settings

The settings screen provides navigation to:

- account
- help and support
- logout

Logout behavior:

- clears favorites from context
- removes the token from `AsyncStorage`
- sends the user back to `SignIn`

### 8.11 Help and Support

The help screen is a built-in documentation page for end users. It explains:

- getting started
- favorites behavior
- search usage
- playback notes
- account usage
- troubleshooting
- privacy and support details

### 8.12 Add Profile Screen

The project contains an `AddProfile` screen with:

- avatar selection
- kids/adult profile type
- parental control toggle

At present, this profile flow is local only. It logs the profile data and navigates to `Home`, but it is not persisted in the backend.

## 9. Frontend State Management

### ChannelContext

Stores:

- `channels`
- `loading`
- `error`

Purpose:

- fetch remote playlist once
- expose parsed channels to consumers such as search

### FavoritesContext

Stores:

- grouped favorite lists

Purpose:

- synchronize favorites with backend
- support optimistic local updates
- provide favorite folder operations to UI components

## 10. Backend Documentation

### 10.1 Server Entry

`server.js` is the backend entry point. It performs the following:

- loads environment variables
- connects to MongoDB
- enables JSON request parsing
- registers auth and user routes
- exposes a root health-style response
- exposes a password reset redirect route
- listens on port `5000`

### 10.2 Database Configuration

MongoDB connection is handled through Mongoose in `config/db.js`.

Required environment variable:

- `MONGO_URI`

### 10.3 User Model

The `User` schema contains:

- `name`
- `email`
- `password`
- `role`
- `favorites`
- `resetPasswordToken`
- `resetPasswordExpires`
- automatic timestamps

Each favorite item stores:

- `name`
- `url`
- `folder`

### 10.4 Authentication Logic

Authentication is implemented in `controllers/authController.js`.

#### Registration

- validates required fields
- checks for existing email
- hashes password with bcrypt
- creates the user
- returns a signed JWT

#### Login

- checks the email exists
- compares password with bcrypt
- returns a JWT on success

#### Forgot Password

- finds the user by email
- generates a random reset token
- stores token and 15-minute expiry in MongoDB
- sends a reset email using Nodemailer

#### Reset Password

- validates token and expiration
- hashes the new password
- clears reset token fields
- returns success response

### 10.5 Authorization Middleware

Protected routes use a JWT middleware that:

- reads `Authorization: Bearer <token>`
- verifies the token using `JWT_SECRET`
- loads the user from MongoDB
- injects `req.user`

### 10.6 User Controller

User-related behavior includes:

- `getMe`: returns current user's name and email
- `updateMe`: updates name, email, and optionally password
- `getFavorites`: returns the user's favorites array
- `addFavorite`: adds a favorite if not already saved
- `removeFavorite`: removes a favorite by URL

### 10.7 Email Utility

Email delivery is handled through Nodemailer with Gmail credentials.

Required environment variables:

- `EMAIL_USER`
- `EMAIL_PASS`

## 11. API Documentation

### Auth Routes

#### `POST /api/auth/register`

Request body:

```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "_id": "userId",
  "name": "Demo User",
  "email": "demo@example.com",
  "token": "jwt-token"
}
```

#### `POST /api/auth/login`

Request body:

```json
{
  "email": "demo@example.com",
  "password": "123456"
}
```

#### `POST /api/auth/forgot-password`

Request body:

```json
{
  "email": "demo@example.com"
}
```

Behavior:

- generates token
- stores expiry
- emails reset link

#### `POST /api/auth/reset-password/:token`

Request body:

```json
{
  "password": "newpassword"
}
```

#### `GET /api/auth/me`

Protected route.

Returns the authenticated user's basic profile.

### User Routes

#### `GET /api/users/me`

Protected route.

Returns:

```json
{
  "name": "Demo User",
  "email": "demo@example.com"
}
```

#### `PUT /api/users/me`

Protected route.

Request body:

```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "password": "optional-new-password"
}
```

#### `GET /api/users/favorites`

Protected route.

Returns the user's favorites array.

#### `POST /api/users/favorites`

Protected route.

Request body:

```json
{
  "name": "Channel Name",
  "url": "http://example.com/stream.m3u8",
  "folder": "Sports"
}
```

#### `DELETE /api/users/favorites`

Protected route.

Request body:

```json
{
  "url": "http://example.com/stream.m3u8"
}
```

### Utility Routes

#### `GET /`

Returns:

```text
IPTV API running...
```

#### `POST /inline-test`

Returns:

```json
{
  "ok": true
}
```

#### `GET /reset-password/:token`

Redirects to:

```text
iptv://reset-password/:token
```

This bridges email links to the mobile app.

## 12. End-to-End Functional Flow

### User Registration and Login

1. User signs up or signs in from the mobile app.
2. Backend validates credentials and returns a JWT.
3. App stores the JWT in `AsyncStorage`.
4. App loads favorites for the authenticated user.
5. User enters the main IPTV interface.

### Watching a Channel

1. App fetches the remote M3U playlist.
2. Playlist is parsed into channel name and URL pairs.
3. User browses or searches for a channel.
4. User opens the channel details screen.
5. User starts playback in the player screen.

### Saving Favorites

1. User opens a channel.
2. User chooses a target favorites folder.
3. App updates favorites state locally.
4. App sends a protected request to backend.
5. Backend stores the favorite under the authenticated user.

### Password Reset

1. User enters email in forgot-password screen.
2. Backend creates a token and sends email.
3. User opens the reset link from email.
4. Backend redirects to `iptv://reset-password/:token`.
5. App opens reset screen using the token.
6. User submits a new password.
7. Backend updates the password and clears token fields.

## 13. Setup and Installation

### 13.1 Prerequisites

- Node.js 20 or later
- npm
- MongoDB instance
- Android Studio for Android builds
- Xcode and CocoaPods for iOS builds
- Gmail account with app password if email reset should work

### 13.2 Backend Setup

```bash
cd iptv-backend
npm install
```

Create `.env` using the provided `.env.example`.

Run the backend:

```bash
npm run dev
```

or

```bash
npm start
```

Default server port:

```text
5000
```

### 13.3 Frontend Setup

```bash
cd iptv
npm install
```

Start Metro:

```bash
npm start
```

Run Android:

```bash
npm run android
```

Run iOS:

```bash
bundle install
bundle exec pod install
npm run ios
```

### 13.4 Configuration Notes

The current frontend does not use a centralized environment system. Backend API URLs are hard-coded in multiple files as:

```text
http://192.168.0.77:5000
```

Before deployment or submission demo, this should be updated to the correct backend host in:

- `iptv/src/screens/SignIn/index.js`
- `iptv/src/screens/SignUp/index.js`
- `iptv/src/screens/ForgotPassword/index.js`
- `iptv/src/screens/ResetPassword/index.js`
- `iptv/src/screens/Account/index.js`
- `iptv/src/context/favorites/favoritesApi.js`

The channel playlist URL is configured in:

- `iptv/src/config/m3u.js`

## 14. Security Notes

Implemented protections:

- passwords are hashed with bcrypt
- JWT protects user-specific routes
- password reset tokens expire after 15 minutes
- favorites are tied to authenticated users

Current security limitations:

- frontend and playlist URLs use plain HTTP
- auth token is stored in `AsyncStorage`, not secure storage
- reset tokens are stored in plaintext in MongoDB
- Gmail credentials are required for production email sending

## 15. Limitations and Current Gaps

This section is important for honest submission documentation.

### 15.1 Hard-Coded Backend URL

The frontend uses a fixed LAN IP address. This means the app will only connect correctly when the backend is available at that exact address.

### 15.2 Folder Rename/Delete Persistence

Favorite folder creation, rename, and delete are primarily local UI operations. Because the backend persists favorites as items with a `folder` field, empty folders are not stored independently, and folder rename/delete behavior is not fully synchronized across app restarts.

### 15.3 Profile Screen Not Persisted

The `AddProfile` screen is present, but it does not save profile data to the backend or local storage.

### 15.4 Duplicate Channel Fetching

Channels are fetched once in `ChannelContext` and again inside the `Home` screen. This works, but it duplicates network activity.

### 15.5 Limited Test Coverage

The frontend currently contains only a basic render test. There are no backend automated tests in the repository.

### 15.6 iOS Deep Link / HTTP Constraints

Android includes the custom `iptv` URL scheme in the manifest. The iOS project currently does not expose the same URL scheme in `Info.plist`, and App Transport Security settings may also affect remote HTTP IPTV loading on iOS.

## 16. Testing Status

### Frontend

- Jest is configured
- one render smoke test exists in `iptv/__tests__/App.test.tsx`

### Backend

- no automated tests are currently included

Recommended future tests:

- auth controller tests
- favorites route tests
- password reset flow tests
- M3U parsing unit tests
- player/navigation integration tests

## 17. Suggested Improvements

- centralize API base URL configuration
- move sensitive tokens to secure storage
- persist favorite folders more cleanly in backend
- unify channel loading through one shared source
- add backend validation and error handling middleware
- add automated test coverage
- add admin/content management capabilities
- support HTTPS endpoints and production deployment settings
- complete iOS deep linking setup

## 18. Conclusion

This IPTV project demonstrates a working full-stack streaming application with authentication, account management, favorites persistence, IPTV playlist ingestion, search, playback, and password recovery. The frontend is structured around reusable screens and context providers, while the backend provides focused REST endpoints backed by MongoDB. The project is functional and presentable, with clear areas identified for production hardening and long-term scalability.
