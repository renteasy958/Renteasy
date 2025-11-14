import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC5VfYIHLMlu3N8z2g-ZP1qy7OXCfNRB2U",
  authDomain: "renteasy-3acd8.firebaseapp.com",
  projectId: "renteasy-3acd8",
  storageBucket: "renteasy-3acd8.firebasestorage.app",
  messagingSenderId: "159820157927",
  appId: "1:159820157927:web:167dce2deec02b8b472342",
  measurementId: "G-8X4MZLZN7D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
