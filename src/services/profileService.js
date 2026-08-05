// The only file that touches Cloud Firestore for user profile documents
// (users/{uid}) and Firebase Storage for avatar images. authService.js
// orchestrates *when* these run (login/register/update); useProfile.js
// and the admin Users page are the only consumers. To swap to a
// different backend later, replace the internals of these functions —
// nothing that calls this file needs to change.

import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  limit,
  runTransaction,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase/firebase";

const USERS_COLLECTION = "users";

// learningLevel keeps the app's existing terminology (matches
// ProfileHeader.jsx/EditProfile.jsx) rather than the generic "level"
// name, so no UI component needs to change just for a field rename.
export const DEFAULT_PROFILE_FIELDS = {
  bio: "",
  photoURL: "",
  bannerUrl: "",
  country: "",
  learningLevel: "Linux Beginner",
  role: "student",
  active: true,
};

function usersRef() {
  return collection(db, USERS_COLLECTION);
}

function userDocRef(uid) {
  return doc(db, USERS_COLLECTION, uid);
}

export async function getProfile(uid) {
  const snapshot = await getDoc(userDocRef(uid));
  return snapshot.exists() ? { id: uid, uid, ...snapshot.data() } : null;
}

// Called once, by authService.register(), right after the Firebase Auth
// account is created.
export async function createProfileDocument(uid, fields) {
  const now = new Date().toISOString();

  const document = {
    ...DEFAULT_PROFILE_FIELDS,
    ...fields,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(userDocRef(uid), document);
  return { id: uid, uid, ...document };
}

// Used by federated sign-in, where Firebase Auth can authenticate a user
// before this application has ever created its matching profile document.
// The transaction keeps first-time sign-ins from creating two profiles in
// different tabs or devices.
export async function ensureProfileDocument(uid, fields) {
  const now = new Date().toISOString();
  const document = {
    ...DEFAULT_PROFILE_FIELDS,
    ...fields,
    createdAt: now,
    updatedAt: now,
  };

  return runTransaction(db, async (transaction) => {
    const profileRef = userDocRef(uid);
    const snapshot = await transaction.get(profileRef);

    if (snapshot.exists()) {
      return { id: uid, uid, ...snapshot.data() };
    }

    transaction.set(profileRef, document);
    return { id: uid, uid, ...document };
  });
}

export async function updateProfile(uid, updates) {
  await updateDoc(userDocRef(uid), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  return getProfile(uid);
}

// Firestore has no unique-field constraint, so username uniqueness is
// enforced here with a query before every register()/updateAccount()
// that changes it.
export async function isUsernameTaken(username, excludeUid = null) {
  const usernameQuery = query(
    usersRef(),
    where("username", "==", username),
    limit(5)
  );
  const snapshot = await getDocs(usernameQuery);
  return snapshot.docs.some((docSnap) => docSnap.id !== excludeUid);
}

// Powers the admin-bootstrap rule in authService.register(): the first
// account ever created becomes admin.
export async function hasAdminUser() {
  const adminQuery = query(usersRef(), where("role", "==", "admin"), limit(1));
  const snapshot = await getDocs(adminQuery);
  return !snapshot.empty;
}

// Admin-facing: full user list for the admin Users page.
export async function getAllProfiles() {
  const snapshot = await getDocs(usersRef());
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    uid: docSnap.id,
    ...docSnap.data(),
  }));
}

// --- Avatar (Firebase Storage) ---

function avatarPath(uid, extension) {
  return `avatars/${uid}/avatar-${Date.now()}.${extension}`;
}

function extensionFromMimeType(type) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export async function uploadAvatar(uid, file) {
  const previousProfile = await getProfile(uid);
  const path = avatarPath(uid, extensionFromMimeType(file.type));
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);

  await updateProfile(uid, { photoURL: downloadUrl });

  if (previousProfile?.photoURL && previousProfile.photoURL !== downloadUrl) {
    try {
      await deleteObject(ref(storage, previousProfile.photoURL));
    } catch {
      // The new image is already the active profile value. A failed old-file
      // cleanup must not make a successful upload look like a failure.
    }
  }

  return downloadUrl;
}

export async function deleteAvatar(uid) {
  const profile = await getProfile(uid);

  if (profile?.photoURL) {
    try {
      await deleteObject(ref(storage, profile.photoURL));
    } catch {
      // Already gone, or the URL wasn't a Storage ref — the Firestore
      // field below is the real source of truth for "has an avatar".
    }
  }

  await updateProfile(uid, { photoURL: "" });
}

// --- Banner / cover image (Firebase Storage) ---
function bannerPath(uid, extension) {
  return `banners/${uid}/banner-${Date.now()}.${extension}`;
}

export async function uploadBanner(uid, file) {
  const previousProfile = await getProfile(uid);
  const path = bannerPath(uid, extensionFromMimeType(file.type));
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);

  await updateProfile(uid, { bannerUrl: downloadUrl });

  if (previousProfile?.bannerUrl && previousProfile.bannerUrl !== downloadUrl) {
    try {
      await deleteObject(ref(storage, previousProfile.bannerUrl));
    } catch {
      // As above, the Firestore field already points at the new image.
    }
  }

  return downloadUrl;
}

export async function deleteBanner(uid) {
  const profile = await getProfile(uid);

  if (profile?.bannerUrl) {
    try {
      await deleteObject(ref(storage, profile.bannerUrl));
    } catch {
      // Already gone, or the URL wasn't a Storage ref.
    }
  }

  await updateProfile(uid, { bannerUrl: "" });
}
