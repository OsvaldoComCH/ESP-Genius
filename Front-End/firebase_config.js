import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUpf8ij7Ky3MtuJXit4uIrNiLWk9rhTKI",
  authDomain: "projeto2-c6314.firebaseapp.com",
  projectId: "projeto2-c6314",
  storageBucket: "projeto2-c6314.firebasestorage.app",
  messagingSenderId: "590843557221",
  appId: "1:590843557221:web:5d79ed9cb6feb39650dd8c"
};

// Initialize Firebase
export const App = initializeApp(firebaseConfig);
export const Auth = getAuth(App);
export const Firestore = getFirestore(App);