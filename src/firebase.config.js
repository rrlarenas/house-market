// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfTEpSuEumOEZYqYGo5saKnYZ_tP8gPaU",
  authDomain: "house-market-app-378e3.firebaseapp.com",
  projectId: "house-market-app-378e3",
  storageBucket: "house-market-app-378e3.appspot.com",
  messagingSenderId: "577177230762",
  appId: "1:577177230762:web:63f3127b486f981d90dfd3"
};

// Initialize Firebase
 initializeApp(firebaseConfig);
export const db = getFirestore()