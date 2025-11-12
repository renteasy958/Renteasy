import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'Boardinghouse';

// Get all boarding houses
export const getAllBoardingHouses = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const boardingHouses = [];
    
    querySnapshot.forEach((doc) => {
      boardingHouses.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return boardingHouses;
  } catch (error) {
    console.error("Error getting boarding houses:", error);
    throw error;
  }
};

// Get a single boarding house by ID
export const getBoardingHouseById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error("Boarding house not found!");
    }
  } catch (error) {
    console.error("Error getting boarding house:", error);
    throw error;
  }
};

// Add a new boarding house
export const addBoardingHouse = async (boardingHouseData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...boardingHouseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log("Boarding house added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding boarding house:", error);
    throw error;
  }
};

// Update an existing boarding house
export const updateBoardingHouse = async (id, updates) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    console.log("Boarding house updated successfully");
  } catch (error) {
    console.error("Error updating boarding house:", error);
    throw error;
  }
};

// Delete a boarding house
export const deleteBoardingHouse = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    console.log("Boarding house deleted successfully");
  } catch (error) {
    console.error("Error deleting boarding house:", error);
    throw error;
  }
};

// Get boarding houses by type
export const getBoardingHousesByType = async (type) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("Type of Boarding House", "==", type)
    );
    
    const querySnapshot = await getDocs(q);
    const boardingHouses = [];
    
    querySnapshot.forEach((doc) => {
      boardingHouses.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return boardingHouses;
  } catch (error) {
    console.error("Error getting boarding houses by type:", error);
    throw error;
  }
};

// Get boarding houses by landlord ID
export const getBoardingHousesByLandlord = async (landlordId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("landlordId", "==", landlordId)
    );
    
    const querySnapshot = await getDocs(q);
    const boardingHouses = [];
    
    querySnapshot.forEach((doc) => {
      boardingHouses.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return boardingHouses;
  } catch (error) {
    console.error("Error getting boarding houses by landlord:", error);
    throw error;
  }
};

// Search boarding houses
export const searchBoardingHouses = async (searchTerm) => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // For production, consider using Algolia or similar service
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const boardingHouses = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const searchableText = `${data['Boarding House Name']} ${data.Address} ${data.Description}`.toLowerCase();
      
      if (searchableText.includes(searchTerm.toLowerCase())) {
        boardingHouses.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    return boardingHouses;
  } catch (error) {
    console.error("Error searching boarding houses:", error);
    throw error;
  }
};