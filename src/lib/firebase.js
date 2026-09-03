// ===============================================================
//  FIREBASE INITIALISATION
// ===============================================================
//  Reads config from Vite env vars (VITE_FIREBASE_*).
//  If the vars are missing the app transparently falls back to
//  browser storage (see src/projects/projectsStore.js) so the site
//  still builds and runs with zero configuration.
//
//  Add these to your local .env / .env.local and to Vercel:
//    VITE_FIREBASE_API_KEY
//    VITE_FIREBASE_AUTH_DOMAIN
//    VITE_FIREBASE_PROJECT_ID
//    VITE_FIREBASE_STORAGE_BUCKET
//    VITE_FIREBASE_MESSAGING_SENDER_ID
//    VITE_FIREBASE_APP_ID
// ===============================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Consider Firebase "configured" only when the essential keys exist.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId,
);

let app = null;
let db = null;
let auth = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, db, auth };
