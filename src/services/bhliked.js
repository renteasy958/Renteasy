import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc,
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'Liked';

// Add a boarding house to liked list
export const addToLiked = async (userId, boardingHouseId) => {
  try {
    // Check if already liked
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      where("boardingHouseId", "==", boardingHouseId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log("Already liked");
      return null; // Already liked
    }
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      boardingHouseId,
      likedAt: new Date().toISOString()
    });
    
    console.log("Added to liked with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding to liked:", error);
    throw error;
  }
};

// Remove from liked list
export const removeFromLiked = async (userId, boardingHouseId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      where("boardingHouseId", "==", boardingHouseId)
    );
    
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, COLLECTION_NAME, document.id));
    });
    
    console.log("Removed from liked");
  } catch (error) {
    console.error("Error removing from liked:", error);
    throw error;
  }
};

// Get all liked boarding houses for a user
export const getLikedByUser = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const liked = [];
    
    querySnapshot.forEach((doc) => {
      liked.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return liked;
  } catch (error) {
    console.error("Error getting liked:", error);
    throw error;
  }
};

// Check if a boarding house is liked by user
export const isLiked = async (userId, boardingHouseId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      where("boardingHouseId", "==", boardingHouseId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking if liked:", error);
    throw error;
  }
};