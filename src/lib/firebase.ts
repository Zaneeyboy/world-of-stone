import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

// Guard auth initialization — getAuth() throws at module-eval time when the
// API key is absent (e.g. Vercel build without env vars). Auth is only used
// in client-side admin pages where NEXT_PUBLIC_* vars are always present.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth: ReturnType<typeof getAuth> = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  ? getAuth(app)
  : (null as any);

export default app;
