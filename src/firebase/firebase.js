// The single place the Firebase SDK is initialized. Every service module
// imports `auth`/`db`/`storage` from here instead of calling
// initializeApp/getAuth/getFirestore/getStorage itself, so there's only
// ever one Firebase App instance in the whole application.

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  // Fails loudly at startup instead of letting every service call fail
  // one-by-one with a cryptic Firebase SDK error the first time it's used.
  console.error(
    "Firebase config is missing. Copy .env.example to .env and fill in " +
      "your project's values from the Firebase Console."
  );
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
