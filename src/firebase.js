// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration from the screenshot
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "spwebagency-f7663.firebasestorage.app",
  messagingSenderId: "297021463392",
  appId: "1:297021463392:web:39a1df644006c250ef1c05",
  measurementId: "G-Z4X8GYELH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export it so App.jsx can use it
export const db = getFirestore(app);
export const auth = getAuth(app);