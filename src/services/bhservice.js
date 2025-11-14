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

// Add boarding house and upload images to Cloudinary
export const addBoardingHouseWithImages = async (boardingHouseData, images = []) => {
  try {
    const imageUrls = [];

    // Cloudinary config via environment variables (set in .env as REACT_APP_...)
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    console.log('Cloudinary config:', { cloudName, uploadPreset });

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary configuration missing. Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET in your .env');
    }

    console.log(`Starting upload of ${images.length} images to Cloudinary...`);

    // images is expected to be an array of File objects
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      console.log(`Uploading image ${i + 1}/${images.length}:`, file.name);
      
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      try {
        const resp = await fetch(url, {
          method: 'POST',
          body: formData
        });

        const data = await resp.json();
        console.log(`Image ${i + 1} response:`, data);

        if (!resp.ok) {
          throw new Error(data.error?.message || `Cloudinary upload failed with status ${resp.status}`);
        }

        const imageUrl = data.secure_url || data.url;
        console.log(`Image ${i + 1} uploaded successfully:`, imageUrl);
        imageUrls.push(imageUrl);
      } catch (uploadError) {
        console.error(`Failed to upload image ${i + 1}:`, uploadError);
        throw uploadError;
      }
    }

    console.log('All images uploaded. Preparing to save to Firestore...');

    const dataToSave = {
      ...boardingHouseData,
      images: imageUrls,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Firestore payload:', dataToSave);

    try {
      const addPromise = addDoc(collection(db, COLLECTION_NAME), dataToSave);
      const timeoutMs = 15000; // 15 seconds
      const docRef = await Promise.race([
        addPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore addDoc timed out after ' + timeoutMs + 'ms')), timeoutMs))
      ]);

      console.log("Boarding house added with ID: ", docRef.id);
      return docRef.id;
    } catch (fireErr) {
      console.error('Firestore addDoc error:', fireErr, 'code:', fireErr.code, 'message:', fireErr.message);
      try {
        const key = `renteasy_failed_submission_${Date.now()}`;
        const payloadForStorage = { data: dataToSave, error: { code: fireErr.code, message: fireErr.message } };
        localStorage.setItem(key, JSON.stringify(payloadForStorage));
        console.warn(`Saved failed submission to localStorage key: ${key}`);
      } catch (lsErr) {
        console.error('Failed to write failed submission to localStorage:', lsErr);
      }
      // Re-throw so the caller can handle and display the error
      throw fireErr;
    }
  } catch (error) {
    console.error("Error adding boarding house with images:", error);
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