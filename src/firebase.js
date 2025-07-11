// src/firebase.js

// Import Firebase core + needed services
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Optional: import storage if you plan to upload files/images
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAn7M63QERfckOeZmRv0oz3LXPRdz0sWiE",
  authDomain: "devsoko-f7bbc.firebaseapp.com",
  projectId: "devsoko-f7bbc",
  storageBucket: "devsoko-f7bbc.appspot.com", // 🔧 corrected the domain here
  messagingSenderId: "446964726645",
  appId: "1:446964726645:web:7574424a4adf7334e9b13c",
  measurementId: "G-55DPCDVQFJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // optional — for file/image uploads
