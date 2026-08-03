// The only file that touches Cloud Firestore for admin-managed content
// (courses/lessons/quizzes/achievements collections) and Firebase
// Storage for admin-uploaded images (course thumbnails, platform logo),
// plus the `settings` Firestore collection (platform settings +
// certificate template, one doc each). Seeds Courses/Lessons/Quizzes/
// Achievements from the real, currently-live curriculum data files the
// first time each collection is read, so admins see actual current
// content — but every create/edit/delete/reorder here is staged to its
// own Firestore collection and does NOT feed back into the
// student-facing app (Course.jsx, Lesson.jsx, the quiz engine, and
// achievement checks all still read the original data/*.js files
// directly). Wiring live-editing back into those files would mean
// rewriting how nearly every major feature loads its data — out of
// scope for an admin panel that must not affect the existing user
// experience.

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  writeBatch,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../firebase/firebase";
import modules from "../data/modules";
import quizzesData from "../data/quizzes";
import achievementsData from "../data/achievements";

const COURSES_COLLECTION = "courses";
const LESSONS_COLLECTION = "lessons";
const QUIZZES_COLLECTION = "quizzes";
const ACHIEVEMENTS_COLLECTION = "achievements";
const SETTINGS_COLLECTION = "settings";

export const DEFAULT_SETTINGS = {
  platformName: "FedoraQuest",
  logoUrl: "",
  theme: "dark",
  defaultLessonXP: 100,
  defaultPassingScore: 70,
  featureToggles: {
    certificatesEnabled: true,
    leaderboardEnabled: false,
    communityEnabled: false,
  },
};

export const DEFAULT_CERTIFICATE_TEMPLATE = {
  brandingText: "FedoraQuest Team",
  accentColor: "#3c6eb4",
  footerNote: "This certificate is issued by FedoraQuest.",
};

function nextId(records) {
  return records.reduce((max, record) => Math.max(max, record.id), 0) + 1;
}

async function isCollectionEmpty(collectionRef) {
  const snapshot = await getDocs(query(collectionRef, limit(1)));
  return snapshot.empty;
}

async function seedIfEmpty(collectionRef, seedRecords) {
  if (!(await isCollectionEmpty(collectionRef))) return;

  const batch = writeBatch(db);
  seedRecords.forEach((record, index) => {
    batch.set(doc(collectionRef, String(record.id)), { ...record, order: index });
  });
  await batch.commit();
}

async function getOrdered(collectionRef) {
  const snapshot = await getDocs(query(collectionRef, orderBy("order", "asc")));
  return snapshot.docs.map((docSnap) => docSnap.data());
}

async function reorderByIds(collectionRef, orderedIds) {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(collectionRef, String(id)), { order: index });
  });
  await batch.commit();
}

// --- Courses (staged from data/modules.js) ---

function coursesRef() {
  return collection(db, COURSES_COLLECTION);
}

function seedCourses() {
  return modules.map((module) => ({
    id: module.id,
    title: module.title,
    description: module.description,
    difficulty: "Beginner",
    estimatedDuration: `${module.lessons.length * 45} min (estimate)`,
    thumbnailUrl: "",
    published: true,
  }));
}

export async function getCourses() {
  await seedIfEmpty(coursesRef(), seedCourses());
  return getOrdered(coursesRef());
}

export async function createCourse(course) {
  const existing = await getOrdered(coursesRef());
  const newCourse = {
    id: nextId(existing),
    title: "",
    description: "",
    difficulty: "Beginner",
    estimatedDuration: "",
    thumbnailUrl: "",
    published: false,
    ...course,
  };
  await setDoc(doc(coursesRef(), String(newCourse.id)), {
    ...newCourse,
    order: existing.length,
  });
  return newCourse;
}

export async function updateCourse(id, updates) {
  await updateDoc(doc(coursesRef(), String(id)), updates);
  return (await getDoc(doc(coursesRef(), String(id)))).data();
}

export async function deleteCourse(id) {
  await deleteDoc(doc(coursesRef(), String(id)));
}

export async function reorderCourses(orderedIds) {
  await reorderByIds(coursesRef(), orderedIds);
}

// --- Lessons (staged from data/modules.js, flat list across all courses) ---

function lessonsRef() {
  return collection(db, LESSONS_COLLECTION);
}

function seedLessons() {
  return modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      id: lesson.id,
      courseId: module.id,
      day: lesson.day,
      title: lesson.title,
      description: lesson.description,
      xp: lesson.xp,
      markdownContent: "",
      codeBlock: "",
      resources: [],
    }))
  );
}

export async function getLessons() {
  await seedIfEmpty(lessonsRef(), seedLessons());
  return getOrdered(lessonsRef());
}

export async function createLesson(lesson) {
  const existing = await getOrdered(lessonsRef());
  const newLesson = {
    id: nextId(existing),
    courseId: null,
    day: "",
    title: "",
    description: "",
    xp: DEFAULT_SETTINGS.defaultLessonXP,
    markdownContent: "",
    codeBlock: "",
    resources: [],
    ...lesson,
  };
  await setDoc(doc(lessonsRef(), String(newLesson.id)), {
    ...newLesson,
    order: existing.length,
  });
  return newLesson;
}

export async function updateLesson(id, updates) {
  await updateDoc(doc(lessonsRef(), String(id)), updates);
  return (await getDoc(doc(lessonsRef(), String(id)))).data();
}

export async function deleteLesson(id) {
  await deleteDoc(doc(lessonsRef(), String(id)));
}

export async function reorderLessons(orderedIds) {
  await reorderByIds(lessonsRef(), orderedIds);
}

// --- Quizzes (staged from data/quizzes/index.js) ---

function quizzesRef() {
  return collection(db, QUIZZES_COLLECTION);
}

function seedQuizzes() {
  return Object.entries(quizzesData).map(([lessonId, quiz], index) => ({
    id: index + 1,
    lessonId: Number(lessonId),
    title: `Quiz — Lesson ${lessonId}`,
    difficulty: quiz.difficulty,
    passingScore: quiz.passingScore,
    timeLimitSeconds: quiz.timeLimitSeconds,
    published: true,
    questions: quiz.questions.map((question) => ({ ...question })),
  }));
}

export async function getQuizzes() {
  await seedIfEmpty(quizzesRef(), seedQuizzes());
  return getOrdered(quizzesRef());
}

export async function createQuiz(quiz) {
  const existing = await getOrdered(quizzesRef());
  const newQuiz = {
    id: nextId(existing),
    lessonId: null,
    title: "",
    difficulty: "beginner",
    passingScore: DEFAULT_SETTINGS.defaultPassingScore,
    timeLimitSeconds: null,
    published: false,
    questions: [],
    ...quiz,
  };
  await setDoc(doc(quizzesRef(), String(newQuiz.id)), {
    ...newQuiz,
    order: existing.length,
  });
  return newQuiz;
}

export async function updateQuiz(id, updates) {
  await updateDoc(doc(quizzesRef(), String(id)), updates);
  return (await getDoc(doc(quizzesRef(), String(id)))).data();
}

export async function deleteQuiz(id) {
  await deleteDoc(doc(quizzesRef(), String(id)));
}

// --- Achievements (staged from data/achievements.js) ---
// Kept keyed by the achievement's own string id (matches the ids baked
// into utils/checkAchievements.js and every user's progress.achievements
// array) rather than a separate numeric id.

function achievementsRef() {
  return collection(db, ACHIEVEMENTS_COLLECTION);
}

function seedAchievements() {
  return achievementsData.map((achievement) => ({ ...achievement }));
}

export async function getAdminAchievements() {
  await seedIfEmpty(achievementsRef(), seedAchievements());
  return getOrdered(achievementsRef());
}

export async function createAchievement(achievement) {
  const existing = await getOrdered(achievementsRef());
  const newAchievement = {
    id: `custom_${Date.now()}`,
    title: "",
    description: "",
    icon: "🏅",
    category: "Learning",
    xpReward: 25,
    unlockCondition: "",
    ...achievement,
  };
  await setDoc(doc(achievementsRef(), newAchievement.id), {
    ...newAchievement,
    order: existing.length,
  });
  return newAchievement;
}

export async function updateAchievement(id, updates) {
  await updateDoc(doc(achievementsRef(), id), updates);
  return (await getDoc(doc(achievementsRef(), id))).data();
}

export async function deleteAchievement(id) {
  await deleteDoc(doc(achievementsRef(), id));
}

// --- Certificate template ---

function certificateTemplateDocRef() {
  return doc(db, SETTINGS_COLLECTION, "certificateTemplate");
}

export async function getCertificateTemplate() {
  const snapshot = await getDoc(certificateTemplateDocRef());
  return snapshot.exists()
    ? { ...DEFAULT_CERTIFICATE_TEMPLATE, ...snapshot.data() }
    : DEFAULT_CERTIFICATE_TEMPLATE;
}

export async function updateCertificateTemplate(updates) {
  const current = await getCertificateTemplate();
  const updated = { ...current, ...updates };
  await setDoc(certificateTemplateDocRef(), updated);
  return updated;
}

// --- Platform settings ---

function platformSettingsDocRef() {
  return doc(db, SETTINGS_COLLECTION, "platform");
}

export async function getSettings() {
  const snapshot = await getDoc(platformSettingsDocRef());
  if (!snapshot.exists()) return DEFAULT_SETTINGS;

  const saved = snapshot.data();
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    featureToggles: { ...DEFAULT_SETTINGS.featureToggles, ...saved.featureToggles },
  };
}

export async function updateSettings(updates) {
  const current = await getSettings();
  const updated = { ...current, ...updates };
  await setDoc(platformSettingsDocRef(), updated);
  return updated;
}

// --- Admin-uploaded images (Firebase Storage) ---

function extensionFromMimeType(type) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export async function uploadLogo(file) {
  const path = `admin/logo.${extensionFromMimeType(file.type)}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadCourseThumbnail(file) {
  const path = `admin/thumbnails/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
