# MYM LBOARD - Mobile App (React Native)

React Native mobile application for the Dispatcher Transport App.

## Project Overview

This is the mobile app for the MYM LBOARD transportation dispatch platform. Supports both iOS and Android with features for:
- Driver authentication (SMS/OTP)
- Real-time load tracking
- GPS location sharing
- In-app notifications
- Load management
- Driver availability status

## Tech Stack

- **Framework:** React Native
- **State Management:** Redux
- **Navigation:** React Navigation
- **Maps:** Google Maps
- **Push Notifications:** Firebase Cloud Messaging
- **HTTP Client:** Axios
- **UI Kit:** React Native Elements
- **Location Services:** React Native Geolocation

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Xcode (for iOS)
- Android Studio (for Android)
- React Native CLI

### Installation

```bash
git clone https://github.com/josephandrejonas-beep/mym-lboard-mobile.git
cd mym-lboard-mobile
npm install
cd ios && pod install && cd ..
```

### Running the App

```bash
npm run ios      # iOS
npm run android  # Android
npm start        # Dev server
```

## Project Structure

```
src/
├── screens/        # UI Screens
├── services/       # API & Business Logic
├── redux/          # State Management
├── components/     # Reusable Components
├── utils/          # Utilities
└── App.js          # Root Component
```

## Features

✅ Phone OTP Authentication
✅ Real-time GPS Tracking
✅ Load Management
✅ Status Updates
✅ Notifications
✅ Google Maps Integration

## Building for App Store

### iOS
```bash
cd ios && xcodebuild -scheme mym-lboard -configuration Release
```

### Android
```bash
cd android && ./gradlew bundleRelease
```

## License

MIT
