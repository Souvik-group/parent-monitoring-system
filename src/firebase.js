// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAIg7gackeNjnEOJQT8x_dfYH3UHuoA2rU",
  authDomain: "parent-92eea.firebaseapp.com",
  projectId: "parent-92eea",
  storageBucket: "parent-92eea.appspot.com",
  messagingSenderId: "202427755924",
  appId: "1:202427755924:web:175b1166efc76eddf07381",
  measurementId: "G-BL3RC4JEB8",
  databaseURL: "https://parent-92eea-default-rtdb.firebaseio.com", // ✅
};

// ✅ Prevent duplicate Firebase App error
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export {db};



