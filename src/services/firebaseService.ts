import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase";
import { Location, PhotoUpload } from "../types";

export const createLocation = async (
  locationData: Omit<Location, "id" | "createdAt">,
) => {
  try {
    const docRef = await addDoc(collection(db, "locations"), {
      ...locationData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating location:", error);
    throw error;
  }
};

export const getLocationByQRCode = async (
  qrCodeId: string,
): Promise<Location | null> => {
  try {
    const q = query(
      collection(db, "locations"),
      where("qrCodeId", "==", qrCodeId),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    } as Location;
  } catch (error) {
    console.error("Error fetching location:", error);
    throw error;
  }
};

export const getAllLocations = async (): Promise<Location[]> => {
  try {
    const q = query(collection(db, "locations"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Location[];
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

export const uploadPhoto = async (
  locationId: string,
  photo: PhotoUpload,
): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileName = `${locationId}/${photo.type}_${timestamp}_${photo.file.name}`;
    const storageRef = ref(storage, `photos/${fileName}`);

    await uploadBytes(storageRef, photo.file);
    const downloadURL = await getDownloadURL(storageRef);

    // Update the location document with the photo URL
    const locationRef = doc(db, "locations", locationId);
    const updateData = {
      [`${photo.type}Photo`]: {
        url: downloadURL,
        uploadedAt: new Date(),
      },
    };

    await updateDoc(locationRef, updateData);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};

export const checkQRCodeExists = async (qrCodeId: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, "locations"),
      where("qrCodeId", "==", qrCodeId),
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking QR code:", error);
    return false;
  }
};
