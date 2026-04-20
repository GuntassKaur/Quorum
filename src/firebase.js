/**
 * QUORUM Firebase Configuration
 * 
 * Uses Firestore for:
 *   - crowdData (per-zone telemetry)
 *   - alerts (AI-generated safety alerts)
 *   - emergencyState (global emergency flag)
 * 
 * Replace the config below with your actual Firebase project credentials.
 * Add VITE_OPENWEATHER_KEY to a .env file for live weather.
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'demo-key',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'quorum-venue.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'quorum-venue',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'quorum-venue.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '1:000000000000:web:000000',
};

// Prevent double-initialization in dev (HMR)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export default app;
