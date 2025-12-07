

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjg_VLNm7nXHy13Wp_uEIZ-fB8kwlsUYA",
  authDomain: "cp-dpnw.firebaseapp.com",
  projectId: "cp-dpnw",
  storageBucket: "cp-dpnw.firebasestorage.app",
  messagingSenderId: "471100176606",
  appId: "1:471100176606:web:173cc050d70b8a34802a4f",
  measurementId: "G-4PQQKSB0DK"
}; 
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
console.log("Firebase initialized");