import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnuPdXeM5eLAwRcEms2QVxcetguw9ZBoY",
  authDomain: "mimtyllb.firebaseapp.com",
  projectId: "mimtyllb",
  storageBucket: "mimtyllb.firebasestorage.app",
  messagingSenderId: "755645680391",
  appId: "1:755645680391:web:27d87ade3004a7a2a413a2",
  measurementId: "G-XGJ8MJBHC7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (আমাদের শুধু Firestore লাগবে)
export const db = getFirestore(app);