// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAn7M63QERfckOeZmRv0oz3LXPRdz0sWiE",
  authDomain: "devsoko-f7bbc.firebaseapp.com",
  projectId: "devsoko-f7bbc",
  storageBucket: "devsoko-f7bbc.firebasestorage.app",
  messagingSenderId: "446964726645",
  appId: "1:446964726645:web:7574424a4adf7334e9b13c",
  measurementId: "G-55DPCDVQFJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const auth = getAuth(app);