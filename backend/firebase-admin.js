// firebase-admin.js
// Initializes Firebase Admin SDK for backend server

const admin = require('firebase-admin');
const path = require('path');

// Path to your service account key JSON file
// Place your service account key in the backend/ directory and update the filename below
const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = { admin, db };