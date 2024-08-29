// FirebaseConfig.js
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Firebase Console'dan alınan API Key
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com", // Genellikle gerekli değil, Firebase Console'dan alınan Auth Domain
  projectId: "food-expriy", // Firebase Console'dan alınan Project ID
  storageBucket: "food-expriy.appspot.com", // Firebase Console'dan alınan Storage Bucket, genellikle `projectId.appspot.com`
  messagingSenderId: "757098159822", // Firebase Console'dan alınan Messaging Sender ID
  appId: "1:757098159822:android:dfe74d1ccbefed9b91fa9f", // Firebase Console'dan alınan App ID
  measurementId: "" // Genellikle isteğe bağlı, Firebase Console'dan alınan Measurement ID (boş bırakabilirsiniz)
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export default firebase;
