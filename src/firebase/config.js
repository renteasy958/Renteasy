import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
   apiKey: "AIzaSyC5VfYIHLMlu3N8z2g-ZP1qy7OXCfNRB2U",
  authDomain: "renteasybhfinder.firebaseapp.com",
  projectId: "renteasybhfinder",
  storageBucket: "renteasybhfinder.firebasestorage.app",
  messagingSenderId: "159820157927",
  appId: "1:159820157927:web:167dce2deec02b8b472342",
  measurementId: "G-8X4MZLZN7D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);