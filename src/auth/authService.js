// ALL authentication logic lives here, and this is the ONLY file that
// calls the Firebase Authentication SDK directly. profileService.js
// owns the matching Firestore users/{uid} document; progressService.js
// owns the matching progress/{uid} document — both get created here,
// once, at registration. AuthProvider only ever calls these functions,
// so no other file needs to know Firebase Authentication exists.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  updateProfile as updateAuthProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  reload,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import * as profileService from "../services/profileService";
import * as progressService from "../services/progressService";

const REMEMBER_ME_KEY = "fedoraquest_remember_me";
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

function friendlyAuthError(error) {
  const code = error?.code || "";

  switch (code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been deactivated.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error — check your connection and try again.";
    case "auth/requires-recent-login":
      return "Please log out and back in, then try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled. Please try again.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in window. Allow pop-ups and try again.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email. Sign in with your email and password instead.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled for this Firebase project.";
    default:
      return error?.message || "Something went wrong. Please try again.";
  }
}

async function buildUserFromFirebaseUser(firebaseUser) {
  const profile = await profileService.getProfile(firebaseUser.uid);
  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    ...profile,
  };
}

function defaultUsername(firebaseUser) {
  return `learner_${firebaseUser.uid.slice(0, 10)}`;
}

function defaultFullName(firebaseUser) {
  if (firebaseUser.displayName?.trim()) return firebaseUser.displayName.trim();
  if (firebaseUser.email) return firebaseUser.email.split("@")[0];
  return "FedoraQuest Learner";
}

async function provisionGoogleAccount(firebaseUser) {
  const hasAdmin = await profileService.hasAdminUser();
  const profile = await profileService.ensureProfileDocument(firebaseUser.uid, {
    fullName: defaultFullName(firebaseUser),
    username: defaultUsername(firebaseUser),
    email: firebaseUser.email || "",
    role: hasAdmin ? "student" : "admin",
    active: true,
    lastLoginAt: new Date().toISOString(),
  });

  await progressService.ensureProgressDocument(firebaseUser.uid);
  return profile;
}

export async function login(email, password, rememberMe) {
  try {
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );

    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const profile = await profileService.getProfile(credential.user.uid);

    if (profile?.active === false) {
      await signOut(auth);
      throw new Error("This account has been deactivated.");
    }

    localStorage.setItem(REMEMBER_ME_KEY, String(Boolean(rememberMe)));

    await profileService.updateProfile(credential.user.uid, {
      lastLoginAt: new Date().toISOString(),
    });

    return buildUserFromFirebaseUser(credential.user);
} catch (error) {
  console.error("Firebase Login Error:", error);

  if (error.message === "This account has been deactivated.") throw error;

  throw new Error(friendlyAuthError(error));
}
}

export async function register(fullName, username, email, password) {
  const normalizedUsername = username.trim().toLowerCase();

  const usernameTaken = await profileService.isUsernameTaken(normalizedUsername);
  if (usernameTaken) {
    throw new Error("This username is already taken.");
  }

  let credential;
  try {
    credential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
  } catch (error) {
    throw new Error(friendlyAuthError(error));
  }

  await updateAuthProfile(credential.user, { displayName: fullName.trim() });

  // Bootstrap: the first account ever registered becomes admin — there's
  // no backend seeding step otherwise. Every account after the first
  // admin defaults to student. Best-effort only (same limitation the
  // local mock had): two people registering in the same instant could
  // theoretically both read "no admin yet".
  const hasAdmin = await profileService.hasAdminUser();

  await profileService.createProfileDocument(credential.user.uid, {
    fullName: fullName.trim(),
    username: username.trim(),
    email: email.trim(),
    role: hasAdmin ? "student" : "admin",
    active: true,
    lastLoginAt: new Date().toISOString(),
  });

  await progressService.createProgressDocument(credential.user.uid);

  localStorage.setItem(REMEMBER_ME_KEY, "true");

  let verificationEmailSent = false;
  try {
    await sendEmailVerification(credential.user);
    verificationEmailSent = true;
  } catch {
    // Registration remains successful if an email provider has a temporary
    // delivery issue. The authenticated user can retry from the banner.
  }

  return {
    ...(await buildUserFromFirebaseUser(credential.user)),
    verificationEmailSent,
  };
}

export async function loginWithGoogle() {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const credential = await signInWithPopup(auth, googleProvider);
    const profile = await provisionGoogleAccount(credential.user);

    if (profile.active === false) {
      await signOut(auth);
      throw new Error("This account has been deactivated.");
    }

    await profileService.updateProfile(credential.user.uid, {
      lastLoginAt: new Date().toISOString(),
    });
    localStorage.setItem(REMEMBER_ME_KEY, "true");

    return buildUserFromFirebaseUser(credential.user);
  } catch (error) {
    if (error.message === "This account has been deactivated.") throw error;
    throw new Error(friendlyAuthError(error));
  }
}

export async function logout() {
  await signOut(auth);
}

// Real-time subscription — replaces the old one-shot getCurrentUser()
// call. AuthProvider calls this once and keeps `user` in sync
// automatically, which is how Firebase Authentication is meant to be
// consumed (rather than polled).
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    try {
      callback(await buildUserFromFirebaseUser(firebaseUser));
    } catch {
      callback(null);
    }
  });
}

// One-shot lookup kept for any caller that needs it outside the
// listener — AuthProvider no longer uses this itself, but the exported
// shape stays available.
export async function getCurrentUser() {
  if (!auth.currentUser) return null;
  return buildUserFromFirebaseUser(auth.currentUser);
}

export async function updateAccount(userId, updates) {
  const { email, ...profileUpdates } = updates;

  if (profileUpdates.username) {
    const normalized = profileUpdates.username.trim().toLowerCase();
    const taken = await profileService.isUsernameTaken(normalized, userId);
    if (taken) throw new Error("This username is already taken.");
  }

  if (email && auth.currentUser && email.trim() !== auth.currentUser.email) {
    try {
      await updateEmail(auth.currentUser, email.trim());
    } catch (error) {
      throw new Error(friendlyAuthError(error));
    }
  }

  if (profileUpdates.fullName && auth.currentUser?.uid === userId) {
    await updateAuthProfile(auth.currentUser, {
      displayName: profileUpdates.fullName.trim(),
    });
  }

  const updated = await profileService.updateProfile(userId, {
    ...profileUpdates,
    ...(email ? { email: email.trim() } : {}),
  });

  return {
    id: userId,
    uid: userId,
    email: auth.currentUser?.uid === userId ? auth.currentUser.email : updated.email,
    ...updated,
  };
}

export async function changePassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be logged in.");

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error) {
    if (
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential"
    ) {
      throw new Error("Current password is incorrect.");
    }
    throw new Error(friendlyAuthError(error));
  }
}

// --- Admin-facing operations ---

export async function getAllUsers() {
  return profileService.getAllProfiles();
}

export async function updateUserRole(userId, role) {
  return profileService.updateProfile(userId, { role });
}

export async function setUserActive(userId, active) {
  return profileService.updateProfile(userId, { active });
}

// The Firebase Auth SDK has no public API to read back which
// persistence mode is currently active, so "remembered on this device"
// is tracked locally alongside login/register — this is bookkeeping,
// not a security-relevant value, so a plain localStorage flag is fine.
export function getSessionInfo() {
  return {
    active: auth.currentUser !== null,
    persistent: localStorage.getItem(REMEMBER_ME_KEY) === "true",
  };
}

export async function requestPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    // Don't reveal whether the account exists — matches real
    // password-reset UX — but real network/config errors still surface.
    if (error.code !== "auth/user-not-found") {
      throw new Error(friendlyAuthError(error));
    }
  }
  return { success: true };
}

export async function resendEmailVerification() {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be logged in to verify your email.");
  if (user.emailVerified) return { alreadyVerified: true };

  try {
    await sendEmailVerification(user);
    return { alreadyVerified: false };
  } catch (error) {
    throw new Error(friendlyAuthError(error));
  }
}

export async function refreshEmailVerification() {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be logged in to verify your email.");

  try {
    await reload(user);
    return buildUserFromFirebaseUser(auth.currentUser);
  } catch (error) {
    throw new Error(friendlyAuthError(error));
  }
}

// Pure helper, not a real auth operation — no async/storage needed.
export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "" };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const clampedScore = Math.min(score, labels.length - 1);

  return { score: clampedScore, label: labels[clampedScore] };
}
