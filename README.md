# ChronoCanvas Mobile

A React Native mobile application for ChronoCanvas journal app, built with Expo.

### Authentication
Supports Anonymous (optional), Email/Password, and Google sign-in via Firebase Auth.

Enable providers in Firebase Console → Authentication → Sign-in method. The error `auth/admin-restricted-operation` means the provider (often Anonymous) is disabled or new sign-ups are blocked.

Configure environment variables in `.env.local` (Expo loads them) with your Firebase project settings plus:

```
EXPO_PUBLIC_GOOGLE_CLIENT_ID=<Web OAuth client ID>
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=<Android OAuth client ID>
```

If you later decide to disable anonymous sign-in, remove the call to `signInAnonymously` and show an auth screen instead.

### Data Model & Sync
Entries live at `users/{uid}/entries/{entryId}` with fields: `title, content, color, createdAt, updatedAt`.

- `createdAt` & `updatedAt` use `serverTimestamp()` for consistent ordering.
- Real-time listener (ordered by `updatedAt desc`).
- HTML is stripped defensively from legacy content before rendering.
- Firestore offline cache handles queued writes; we add a lightweight optimistic concurrency check on updates.

### Local Development
1. Install deps: `npm install`
2. Create `.env.local` with Firebase keys and Google client ID.
3. Start: `npm start` then run on device/emulator.

### Future Hardening Ideas
- Field allowlist & type validation in security rules (see commented examples in `firestore.rules`).
- Stronger concurrency via a numeric `version` field.
- At-rest encryption for journal content (client-side symmetric key per user synchronized via user credential).
- Full-text search via an external index (e.g. Typesense, Meilisearch) fed by Cloud Functions.
- Attachment support (images) using Firebase Storage with rule pairing.

### Firestore Security Rules
Rules file: `firestore.rules`. Deploy to your active project (e.g. `chronopad-e252c`):

```
firebase deploy --only firestore:rules
```

Summary:
- Authenticated user ↔ their own subtree only.
- Global deny fallback.
- Uncomment provided validation snippets to enforce schema & immutability of `createdAt`.

Add an index (if needed later for compound queries) via Firebase console or `firestore.indexes.json`.

### Offline & Conflict Strategy
Current behavior:
1. Firestore offline persistence (queue + cache) handles connectivity drops.
2. Writes use server timestamps; ordering is deterministic by `updatedAt`.
3. Update path uses a Firestore transaction comparing previous `updatedAt` (optimistic concurrency). If mismatch, it logs a conflict; you can prompt user to reload.

Potential upgrades:
- Conflict resolution UI (diff & merge).
- Add numeric `version` increment to block stale overwrites more explicitly.
- Maintain local optimistic queue state for user feedback on pending sync.

### Suggested Indexes
Current query: orderBy updatedAt only (no filter) — no composite index required. If you add filters like `where('color','==',X)` with the order, Firestore will prompt to create an index.

### Android Build Guide
Profiles (see `eas.json`):
- development: Dev client + internal distribution.
- preview: Internal APK (quick install) buildType=apk.
- production: Play Store AAB.

Steps:
1. Login & configure EAS
   ```pwsh
   npx expo login
   npx eas whoami
   ```
2. Create Keystore (EAS manages automatically on first prod build). Save credentials after build.
3. Build preview APK for testers:
   ```pwsh
   npx eas build --platform android --profile preview
   ```
4. Production AAB:
   ```pwsh
   npx eas build --platform android --profile production
   ```
5. Submit to Play (after creating app in Play Console):
   ```pwsh
   npx eas submit --platform android --profile production --latest
   ```

Local debug (faster iteration):
```pwsh
npx expo run:android
```

Add Google Sign-In SHA:
1. Get SHA-1/256 from EAS credentials page (production) and debug keystore locally.
2. Add both fingerprints in Firebase Console → Android app settings.
3. If you rely on native Google services later (not just OAuth via Auth Session), download and place `google-services.json` under `android/app` (not required for current env-based config).

New Architecture: Removed `newArchEnabled: false`; Expo Go always runs new arch. Avoid conflicting flags in production.

Custom URL Scheme: Added `scheme: "chronocanvas"` for OAuth redirects; ensure `redirectUri` generation in auth flows references it.

Environment:
Ensure `EXPO_PUBLIC_GOOGLE_CLIENT_ID` points to Web OAuth client; add an Android OAuth client (package name + SHA) for better reliability when moving to native Google services.

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
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_web_oauth_client_id
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_oauth_client_id
```

## 📦 Dependencies

- **Expo**: React Native framework
- **React Navigation**: Navigation library
- **Firebase**: Backend services
- **React Native Safe Area Context**: Safe area handling
- **React Native Screens**: Native screen components

## 🔐 Security Notes

- Do not commit real secrets; Firebase client keys are public by design but still avoid leaking unused projects.
- Use `.env.example` as a template; only `EXPO_PUBLIC_` prefixed vars are exposed to the bundle.
- Deploy updated security rules whenever you modify `firestore.rules` (CI step recommended).

## 🐛 Troubleshooting
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `auth/admin-restricted-operation` on anonymous sign-in | Anonymous provider disabled | Enable in Firebase Auth settings or remove usage |
| Repeating Firestore WebChannel transport errors | Network offline / emulator networking / WebChannel instability | Ensure network; forced long polling via `experimentalForceLongPolling` |
| Google sign-in fails in release only | Missing release SHA-1 in Firebase | Add release SHA-1 & SHA-256, wait a few minutes |
| Expo build linking fails (invalid projectId) | Non-UUID projectId used | Use real EAS project UUID in `app.json` |
| OAuth redirect stuck | Missing `scheme` in config | Add `scheme` under `expo` |


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
