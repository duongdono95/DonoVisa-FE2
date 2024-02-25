// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "donovista-authentication.firebaseapp.com",
  projectId: "donovista-authentication",
  storageBucket: "donovista-authentication.appspot.com",
  messagingSenderId: "230438935505",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-8SJ44V1F8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);