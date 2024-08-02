// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBijPRHdTjOznbL1fuThhC-MVaVWjLcx10",
  authDomain: "pantrytracker-55282.firebaseapp.com",
  projectId: "pantrytracker-55282",
  storageBucket: "pantrytracker-55282.appspot.com",
  messagingSenderId: "168567739062",
  appId: "1:168567739062:web:3768105b00d09311188c17",
  measurementId: "G-9EWBTD4881"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export { firestore }