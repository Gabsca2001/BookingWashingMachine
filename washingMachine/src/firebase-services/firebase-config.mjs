import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBe-Xj364uZQyUPXu4hoCKiRu8BxpphfFE",
    authDomain: "booking-laundry-liborio.firebaseapp.com",
    projectId: "booking-laundry-liborio",
    storageBucket: "booking-laundry-liborio.firebasestorage.app",
    messagingSenderId: "505464444736",
    appId: "1:505464444736:web:80a50556fcd24428544ca5"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
