// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-firestore.js";
import { getAuth, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD2GGWWPn5P2xgw7YGWiJ5ZUXFRbHJkVy4",
  authDomain: "bacheca-presonale.firebaseapp.com",
  projectId: "bacheca-presonale",
  storageBucket: "bacheca-presonale.firebasestorage.app",
  messagingSenderId: "147412610802",
  appId: "1:147412610802:web:b7cddfbf3a11c312576a6b",
  measurementId: "G-QM12GWW70Y"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
