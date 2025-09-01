// firebase-init.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2GGWWPn5P2xgw7YGWiJ5ZUXFRbHJkVy4",
  authDomain: "bacheca-presonale.firebaseapp.com",
  projectId: "bacheca-presonale",
  storageBucket: "bacheca-presonale.firebasestorage.app",
  messagingSenderId: "147412610802",
  appId: "1:147412610802:web:b7cddfbf3a11c312576a6b",
  measurementId: "G-QM12GWW70Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Export to use in other scripts
export { db, auth };
