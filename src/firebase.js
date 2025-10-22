// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);