// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCU0a5HOmJldFwU1OGNmHzBi-2RLSz7tVs",
  authDomain: "food-expriy.firebaseapp.com",
  projectId: "food-expriy",
  storageBucket: "food-expriy.appspot.com",
  messagingSenderId: "757098159822",
  appId: "1:757098159822:web:794f199f2d3a5dbe91fa9f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
