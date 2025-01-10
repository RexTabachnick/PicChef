import { initializeApp, deleteApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

// Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD9OOtn2yjeJjLI8MT8OkFvOjHhjEqT8gQ',
  authDomain: 'pantryaiapp-43a77.firebaseapp.com',
  databaseURL: 'https://pantryaiapp-43a77-default-rtdb.firebaseio.com',
  projectId: 'pantryaiapp-43a77',
  storageBucket: 'pantryaiapp-43a77.firebasestorage.app',
  messagingSenderId: '187923511523',
  appId: '1:187923511523:ios:01c75ab0194d20ad686dd6',
};

if (getApps().length > 0) {
    deleteApp(getApp()).catch((error) =>
      console.warn('Error deleting Firebase app:', error)
    );
  }
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  // Export the database instance
  const database = getDatabase(app);

/**
 * Writes data to the Firebase Realtime Database.
 * @param path - The path in the database where the data should be written.
 * @param data - The data to write.
 */
export const writeToDatabase = (path: string, data: any) => {
  const dbRef = ref(database, path); // Get a reference to the path
  return set(dbRef, data) // Write data to the specified path
    .then(() => {
      console.log(`Data written to ${path}:`, data);
    })
    .catch((error) => {
      console.error(`Failed to write to ${path}:`, error);
    });
};

export { database };
