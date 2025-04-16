import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBQVP8ShlNgNT8sRcw6fJ6y24bTkuOrsto",
    authDomain: "vibeify-d6109.firebaseapp.com",
    databaseURL: "https://vibeify-d6109-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "vibeify-d6109",
    storageBucket: "vibeify-d6109.appspot.com",
    messagingSenderId: "824327220029",
    appId: "1:824327220029:web:a7055934ff24cbcf01b354",
    measurementId: "G-SG83B2YQBW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional, only for web apps)
let analytics;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}

export { app, analytics };