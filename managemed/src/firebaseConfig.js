
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMW8Rb1sGFAtXxN_RGR0Eql_hLwGP4vL4",
  authDomain: "unihack2024-ansera.firebaseapp.com",
  databaseURL: "https://unihack2024-ansera-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "unihack2024-ansera",
  storageBucket: "unihack2024-ansera.firebasestorage.app",
  messagingSenderId: "20495581447",
  appId: "1:20495581447:web:e3c62a74766da82ca245a2",
  measurementId: "G-CSSPSMW70D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Export auth to be used in other files
export { auth };
