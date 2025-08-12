import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth, inMemoryPersistence } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Fallback to initializeAuth with basic inMemoryPersistence (Hermes-safe) and manually mirror to AsyncStorage
let auth: Auth;
if (getApps().length === 1) {
  auth = initializeAuth(app, {
    persistence: inMemoryPersistence
  });
  // Mirror current user auth state token to AsyncStorage (lightweight) if needed later
} else {
  auth = getAuth(app);
}

// Force long polling to avoid intermittent WebChannel transport errors on some networks / emulators
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});

export { app, auth, db };
