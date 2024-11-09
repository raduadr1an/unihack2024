// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // Export the Firebase Authentication instance


//Replace YOUR_API_KEY, YOUR_AUTH_DOMAIN, and other placeholders with the actual credentials from your Firebase project.

/*apiKey: "AIzaSyCMW8Rb1sGFAtXxN_RGR0Eql_hLwGP4vL4",
  authDomain: "unihack2024-ansera.firebaseapp.com",
  databaseURL: "https://unihack2024-ansera-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "unihack2024-ansera",
  storageBucket: "unihack2024-ansera.firebasestorage.app",
  messagingSenderId: "20495581447",
  appId: "1:20495581447:web:e3c62a74766da82ca245a2",
  measurementId: "G-CSSPSMW70D"*/