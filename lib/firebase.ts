
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBdsFnXRJEHuslnagjXqaRJ5ZXPaqxL_4",
  authDomain: "hadahana-ai-5ecbe.firebaseapp.com",
  projectId: "hadahana-ai-5ecbe",
  storageBucket: "hadahana-ai-5ecbe.firebasestorage.app",
  messagingSenderId: "789280996911",
  appId: "1:789280996911:web:afd205e0b226b3b78e90da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
