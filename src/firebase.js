// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration from the screenshot
const firebaseConfig = {
  apiKey: "AIzaSyDhlWJZYYsKquRd9a4BYaqK-yMqQwm5rYw",
  authDomain: "spwebagency-f7663.firebaseapp.com",
  projectId: "spwebagency-f7663",
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