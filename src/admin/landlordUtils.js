import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const fetchVerifiedLandlords = async () => {
  const querySnapshot = await getDocs(collection(db, 'landlords'));
  return querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(l => l.verified === true);
};

export const fetchUnverifiedLandlords = async () => {
  const querySnapshot = await getDocs(collection(db, 'landlords'));
  return querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(l => !l.verified);
};
