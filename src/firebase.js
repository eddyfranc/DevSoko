// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAn7M63QERfckOeZmRv0oz3LXPRdz0sWiE",
  authDomain: "devsoko-f7bbc.firebaseapp.com",
  projectId: "devsoko-f7bbc",
  storageBucket: "devsoko-f7bbc.appspot.com",
  messagingSenderId: "446964726645",
  appId: "1:446964726645:web:7574424a4adf7334e9b13c",
  measurementId: "G-55DPCDVQFJ"
};

const app = initializeApp(firebaseConfig);

// 🔥 Removed getAnalytics() — only used in production HTTPS
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
