// ALL authentication logic lives here, and this is the ONLY file that
// touches localStorage/sessionStorage for auth data. To migrate to
// Firebase Authentication or Supabase Auth later, replace the internals
// of these functions with real SDK calls — every function already
// returns a Promise, and AuthProvider only ever calls these functions,
// so no other file needs to change.
//
// IMPORTANT: this is a local, offline mock with no backend. Passwords
// are stored in plain text in localStorage purely to simulate a user
// database in the browser. This is NOT secure and must never be treated
// as real security — password hashing/salting belongs server-side, once
// a real backend exists.

const USERS_KEY = "fedoraquest_users";
const SESSION_KEY = "fedoraquest_session";

function getUsers() {
  const saved = localStorage.getItem(USERS_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function stripPassword(user) {
  const { password, ...safeUser } = user;
  void password;
  return safeUser;
}

function readSession() {
  const local = localStorage.getItem(SESSION_KEY);
  if (local) return JSON.parse(local);

  const session = sessionStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

// "Remember Me" maps to a real storage distinction: checked sessions go
// in localStorage (survive closing the browser), unchecked sessions go
// in sessionStorage (cleared when the tab/browser closes).
function writeSession(session, rememberMe) {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);

  const payload = JSON.stringify(session);
  if (rememberMe) {
    localStorage.setItem(SESSION_KEY, payload);
  } else {
    sessionStorage.setItem(SESSION_KEY, payload);
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export async function login(email, password, rememberMe) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password.");
  }

  // Minimum required session data — just enough to look the user back up.
  writeSession({ userId: user.id }, rememberMe);
  return stripPassword(user);
}

export async function register(fullName, username, email, password) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  if (users.some((u) => u.username.toLowerCase() === normalizedUsername)) {
    throw new Error("This username is already taken.");
  }

  const newUser = {
    id: crypto.randomUUID(),
    fullName: fullName.trim(),
    username: username.trim(),
    email: email.trim(),
    password,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);
  writeSession({ userId: newUser.id }, true);

  return stripPassword(newUser);
}

export async function logout() {
  clearSession();
}

export async function getCurrentUser() {
  const session = readSession();
  if (!session) return null;

  const users = getUsers();
  const user = users.find((u) => u.id === session.userId);
  return user ? stripPassword(user) : null;
}

export async function requestPasswordReset(email) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  // Intentionally doesn't reveal whether the account exists — matches
  // real password-reset UX, and gives this stub the same external
  // behavior a real Firebase/Supabase call would have.
  const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail);
  void exists;

  return { success: true };
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
