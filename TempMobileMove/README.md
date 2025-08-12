# ChronoCanvas Mobile

A React Native mobile application for ChronoCanvas journal app, built with Expo.

## 📱 Features

- **Google Authentication** - Secure login with Google accounts
- **Journal Entry Creation** - Create and manage personal journal entries
- **Cross-platform** - Runs on both Android and iOS
- **Firebase Integration** - Real-time data synchronization

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development on macOS)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your actual Firebase configuration values.

3. **Start the development server**:
   ```bash
   npx expo start
   ```

### Running on Device/Simulator

#### Android
```bash
npx expo run:android
```

#### iOS (macOS only)
```bash
npx expo run:ios
```

#### Web
```bash
npx expo start --web
```

## 🏗️ Building for Production

### Android APK (for testing)
```bash
eas build --platform android --profile preview
```

### Android AAB (for Play Store)
```bash
eas build --platform android --profile production
```

### iOS (macOS only)
```bash
eas build --platform ios --profile production
```

## 📁 Project Structure

```
src/
├── lib/
│   └── firebase.ts          # Firebase configuration
├── screens/
│   ├── LoginScreen.tsx      # Authentication screen
│   ├── MainScreen.tsx       # Main journal dashboard
│   └── CreateEntryScreen.tsx # Entry creation screen
└── components/              # Reusable UI components
```

## 🔧 Configuration

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your existing ChronoCanvas project
3. Add an Android/iOS app to your project
4. Download the configuration file
5. Update your `.env` file with the configuration values

### EAS Build Configuration

The `eas.json` file contains build configurations:

- **development**: For development builds with debugging
- **preview**: For internal testing (APK for Android)
- **production**: For app store releases

## 🌐 Environment Variables

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 📦 Dependencies

- **Expo**: React Native framework
- **React Navigation**: Navigation library
- **Firebase**: Backend services
- **React Native Safe Area Context**: Safe area handling
- **React Native Screens**: Native screen components

## 🔐 Security Notes

- Never commit `.env` files with real credentials
- Use `.env.example` for sharing configuration templates
- Environment variables with `EXPO_PUBLIC_` prefix are available to client-side code

## 🚀 Deployment

### Android Play Store
1. Build production AAB: `eas build --platform android --profile production`
2. Upload to Google Play Console
3. Follow Play Store review process

### iOS App Store (macOS required)
1. Build production IPA: `eas build --platform ios --profile production`
2. Upload to App Store Connect
3. Follow App Store review process

## 🛠️ Development

### Running in Development Mode
```bash
npx expo start
```

Then scan the QR code with:
- **Android**: Expo Go app
- **iOS**: Camera app or Expo Go app

### Debugging
- Use React Native Debugger
- Enable remote debugging in development builds
- Use console.log statements for basic debugging

## 📄 License

This project is private and proprietary to ChronoCanvas.
