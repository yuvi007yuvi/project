import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApC-XHXK3yTZEXd8M-7aU_dgw4Hge_GXI",
  authDomain: "before-and-after-qr.firebaseapp.com",
  databaseURL:
    "https://before-and-after-qr-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "before-and-after-qr",
  storageBucket: "before-and-after-qr.firebasestorage.app",
  messagingSenderId: "470755365915",
  appId: "1:470755365915:web:3ac203ca39878f304754be",
  measurementId: "G-50KBFQXV1S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);

export const analytics = getAnalytics(app);

export default app;
