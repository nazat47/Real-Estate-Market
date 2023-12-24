// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "nazstate.firebaseapp.com",
  projectId: "nazstate",
  storageBucket: "nazstate.appspot.com",
  messagingSenderId: "359503159059",
  appId: "1:359503159059:web:110659cf57d29b738e44e6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);