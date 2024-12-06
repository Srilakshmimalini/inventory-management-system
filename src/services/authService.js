// src/services/authService.js
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail,
    updateProfile
  } from 'firebase/auth';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { auth, firestore } from './firebaseConfig';
  
  class AuthService {
    // User Registration
    async register(email, password, displayName) {
      try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          email, 
          password
        );
        const user = userCredential.user;
  
        // Update user profile with display name
        await updateProfile(user, { displayName });
  
        // Create user document in Firestore
        await this.createUserDocument(user, { displayName });
  
        return user;
      } catch (error) {
        console.error('Registration Error:', error);
        throw error;
      }
    }
  
    // Create User Document in Firestore
    async createUserDocument(user, additionalData = {}) {
      if (!user) return;
  
      const userRef = doc(firestore, 'users', user.uid);
  
      try {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date(),
          ...additionalData
        });
      } catch (error) {
        console.error('Error creating user document', error);
      }
    }
  
    // User Login
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          email, 
          password
        );
        return userCredential.user;
      } catch (error) {
        console.error('Login Error:', error);
        throw error;
      }
    }
  
    // User Logout
    async logout() {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Logout Error:', error);
        throw error;
      }
    }
  
    // Password Reset
    async resetPassword(email) {
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (error) {
        console.error('Password Reset Error:', error);
        throw error;
      }
    }
  
    // Get User Profile
    async getUserProfile(uid) {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', uid));
        
        if (userDoc.exists()) {
          return userDoc.data();
        } else {
          throw new Error('User profile not found');
        }
      } catch (error) {
        console.error('Get User Profile Error:', error);
        throw error;
      }
    }
  
    // Update User Profile
    async updateUserProfile(uid, updateData) {
      try {
        const userRef = doc(firestore, 'users', uid);
        await setDoc(userRef, updateData, { merge: true });
      } catch (error) {
        console.error('Update User Profile Error:', error);
        throw error;
      }
    }
  }
  
  export default new AuthService();