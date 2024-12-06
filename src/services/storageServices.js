import { 
    ref, 
    uploadBytes, 
    getDownloadURL 
  } from 'firebase/storage';
  import { storage } from './firebaseConfig';
  
  class StorageService {
    // Upload File
    async uploadFile(file, path) {
      try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return {
          url: downloadURL,
          path: snapshot.ref.fullPath
        };
      } catch (error) {
        console.error('File upload error:', error);
        throw error;
      }
    }
  
    // Delete File
    async deleteFile(filePath) {
      try {
        const fileRef = ref(storage, filePath);
        // Implement delete logic here
      } catch (error) {
        console.error('File deletion error:', error);
        throw error;
      }
    }
  
    // Generate Unique File Name
    generateUniqueFileName(originalFileName) {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 7);
      const fileExtension = originalFileName.split('.').pop();
      
      return `${timestamp}-${randomString}.${fileExtension}`;
    }
  }
  
  export default new StorageService();