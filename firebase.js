// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVU5aG7hGHgwJLDZstQzQ7sOgpDNVF3IA",
  authDomain: "inventory-nextjs-231fa.firebaseapp.com",
  projectId: "inventory-nextjs-231fa",
  storageBucket: "inventory-nextjs-231fa.appspot.com",
  messagingSenderId: "192188983263",
  appId: "1:192188983263:web:8fad8bfc458e3ff967066a",
  measurementId: "G-C0SSNE3Z5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {app, firestore}