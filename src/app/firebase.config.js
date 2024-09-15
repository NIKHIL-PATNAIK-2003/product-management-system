// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from 'firebase/storage'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2HA1eKLRlkzTVTr5yVahch9AkubAc0Uo",
  authDomain: "sih-team-enlighter.firebaseapp.com",
  projectId: "sih-team-enlighter",
  storageBucket: "sih-team-enlighter.appspot.com",
  messagingSenderId: "699807937180",
  appId: "1:699807937180:web:dfb9d41199b643c568f359"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDb= getStorage(app)