/**
 * QUORUM Firebase Configuration
 * v6.1.0: Added Analytics for View Tracking
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, logEvent as firebaseLogEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'demo-key',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'quorum-77bfa.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'quorum-77bfa',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'quorum-77bfa.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '1:000000000000:web:000000',
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID      || 'G-0000000000'
};

// Prevent double-initialization in dev (HMR)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Initialize Analytics safely (it only works in browsers)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export const logEvent = (eventName, params) => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }
};

export default app;
