import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Fixed import path

const firebaseConfig = {
  apiKey: "AIzaSyBgdEEfuLzBn95WWe8PkfVY8BEDoI4Gx8s",
  authDomain: "parent-view-3e01a.firebaseapp.com",
  projectId: "parent-view-3e01a",
  storageBucket: "parent-view-3e01a.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "621929590717",
  appId: "1:621929590717:web:a97a97e21e49c81d0b6cd4",
  measurementId: "G-RE5T0Y7GQT",
};

// Initialize Firebase app for project1
const app1 = initializeApp(firebaseConfig, "project1");
export const db1 = getFirestore(app1); // Export Firestore instance