// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBw2HCkaC-dlRqoAc0tD73BBTTQ95BRBmE",
    authDomain: "math-tts-464ea.firebaseapp.com",
    projectId: "math-tts-464ea",
    storageBucket: "math-tts-464ea.appspot.com",
    messagingSenderId: "633736228548",
    appId: "1:633736228548:web:e98804c82448aa4ba5e391",
    measurementId: "G-D5HQ7GZM8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);