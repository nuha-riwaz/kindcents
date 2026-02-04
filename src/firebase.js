import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDVADN03C0t9ZZlmsuG3pcRgpmTK0gvZvY",
    authDomain: "kindcents.firebaseapp.com",
    projectId: "kindcents",
    storageBucket: "kindcents.firebasestorage.app",
    messagingSenderId: "511802487791",
    appId: "1:511802487791:web:f90a50c01a881f29a7bc1a",
    measurementId: "G-GGC1RYHQR9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
