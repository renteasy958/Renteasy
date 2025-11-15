// firebase.js - COMPLETE REWRITE

import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5VfYIHLMlu3N8z2g-ZP1qy7OXCfNRB2U",
  authDomain: "renteasybhfinder.firebaseapp.com",
  projectId: "renteasybhfinder",
  storageBucket: "renteasybhfinder.firebasestorage.app",
  messagingSenderId: "159820157927",
  appId: "1:159820157927:web:167dce2deec02b8b472342",
  measurementId: "G-8X4MZLZN7D"
};

console.log('🔥 [Firebase] Starting initialization...');
console.log('🔥 [Firebase] Project ID:', firebaseConfig.projectId);

// Initialize Firebase App
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ [Firebase] App initialized successfully');
  console.log('✅ [Firebase] App name:', app.name);
  console.log('✅ [Firebase] App options:', app.options);
} catch (error) {
  console.error('❌ [Firebase] Failed to initialize app:', error);
  throw error;
}

// Initialize Firestore
let db;
try {
  db = getFirestore(app);
  console.log('✅ [Firestore] Instance created');
  console.log('✅ [Firestore] Type:', db.type);
  console.log('✅ [Firestore] App:', db.app.name);
  
  // Log the internal Firestore settings
  console.log('✅ [Firestore] Settings:', {
    host: db._delegate?._settings?.host || 'firestore.googleapis.com',
    ssl: db._delegate?._settings?.ssl ?? true
  });
} catch (error) {
  console.error('❌ [Firestore] Failed to create instance:', error);
  throw error;
}

// Initialize Auth
let auth;
try {
  auth = getAuth(app);
  console.log('✅ [Auth] Instance created');
} catch (error) {
  console.error('❌ [Auth] Failed to initialize:', error);
  // don't throw here; allow Firestore-only usage in rare cases
}

// Try to enable offline persistence (optional but good for debugging)
enableIndexedDbPersistence(db)
  .then(() => console.log('✅ [Firestore] Offline persistence enabled'))
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('⚠️ [Firestore] Multiple tabs open, persistence only enabled in one tab');
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️ [Firestore] Browser doesn\'t support persistence');
    } else {
      console.warn('⚠️ [Firestore] Persistence error:', err);
    }
  });

// Export app, db and auth for use throughout the app
export { app, db, auth };

// Add a test function you can call from console
window.testFirestoreConnection = async () => {
  console.log('🧪 [Test] Starting Firestore connection test...');
  
  const { collection, addDoc } = await import('firebase/firestore');
  
  try {
    const testData = {
      testField: 'Connection test from browser',
      timestamp: new Date().toISOString(),
      random: Math.random()
    };
    
    console.log('🧪 [Test] Writing to Firestore...', testData);
    
    const docRef = await addDoc(collection(db, 'connectionTest'), testData);
    
    console.log('✅ [Test] SUCCESS! Document created:', docRef.id);
    console.log('✅ [Test] Path: connectionTest/' + docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ [Test] FAILED:', error);
    console.error('❌ [Test] Error code:', error.code);
    console.error('❌ [Test] Error message:', error.message);
    
    return { success: false, error: error.message };
  }
};

console.log('🎯 [Firebase] Initialization complete!');
console.log('💡 [Firebase] Type "testFirestoreConnection()" in console to test connection');