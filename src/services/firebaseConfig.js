// src/services/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Detailed Firebase Configuration with Error Handling
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyB-OwxP7XhoGRjH7QumXHSlckSqFs7lX9Y",
  authDomain: "inventory-management-sys-b140b.firebaseapp.com",
  projectId: "inventory-management-sys-b140b",
  storageBucket: "inventory-management-sys-b140b.firebasestorage.app",
  messagingSenderId: "896472308254",
  appId: "1:896472308254:web:d4028729c7482065deec0f",
  measurementId: "G-YKRSTEMJQZ"
};

// Validate Firebase Configuration
function validateFirebaseConfig(config) {
  const requiredKeys = [
    'apiKey', 'authDomain', 'projectId', 
    'storageBucket', 'messagingSenderId', 'appId'
  ];

  const missingKeys = requiredKeys.filter(key => !config[key]);
  
  if (missingKeys.length > 0) {
    console.error('Missing Firebase Configuration Keys:', missingKeys);
    throw new Error('Incomplete Firebase Configuration');
  }
}

// Validate config before initialization
validateFirebaseConfig(firebaseConfig);

// Initialize Firebase with Enhanced Error Handling
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Connection Test Function
async function testFirebaseConnection() {
  try {
    // Test Authentication State
    onAuthStateChanged(auth, (user) => {
      console.log('Auth State Listener Initialized');
      if (user) {
        console.log('Current User:', user.email);
      } else {
        console.log('No user signed in');
      }
    });

    // Test Firestore Connection
    const testCollectionRef = collection(firestore, 'test_connection');
    const snapshot = await getDocs(testCollectionRef);
    
    console.log('Firestore Connection Successful');
    console.log('Test Collection Documents:', snapshot.docs.length);

    return true;
  } catch (error) {
    console.error('Firebase Connection Test Failed:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return false;
  }
}

// Export connection test function
export { 
  app, 
  auth, 
  firestore, 
  testFirebaseConnection 
};