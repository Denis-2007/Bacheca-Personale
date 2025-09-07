// Import SDK Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Configurazione Firebase (presa dal tuo file)
const firebaseConfig = {
  apiKey: "AIzaSyDplTt9uQ0V7HjKxB_HBaJjx5euMbvK9eA",
  authDomain: "bacheca-firebase.firebaseapp.com",
  projectId: "bacheca-firebase",
  storageBucket: "bacheca-firebase.appspot.com",
  messagingSenderId: "454108717508",
  appId: "1:454108717508:web:3d2f67f0c7b40b2c7f6710"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
