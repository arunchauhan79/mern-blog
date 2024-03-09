// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

console.log(import.meta.env.VITE_FIREBASE_API_KEY)
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-e1d97.firebaseapp.com",
  projectId: "mern-blog-e1d97",
  storageBucket: "mern-blog-e1d97.appspot.com",
  messagingSenderId: "497894477596",
  appId: "1:497894477596:web:0196a13c0f38c2ba8a74d9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);