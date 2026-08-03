// The only file touching localStorage for admin-managed content and
// platform settings. Seeds Courses/Lessons/Quizzes/Achievements from the
// real, currently-live curriculum data files on first access, so admins
// see actual current content — but every create/edit/delete/reorder here
// is staged to its own localStorage keys and does NOT feed back into the
// student-facing app (Course.jsx, Lesson.jsx, the quiz engine, and
// achievement checks all still read the original data/*.js files
// directly). Wiring live-editing back into those files would mean
// rewriting how nearly every major feature loads its data — out of
// scope for an admin panel that must not affect the existing user
// experience. To connect this to a real backend later, replace the
// internals of these functions; useAdmin.js and every admin component
// stay unchanged.

import modules from "../data/modules";
import quizzesData from "../data/quizzes";
import achievementsData from "../data/achievements";

const COURSES_KEY = "fedoraquest_admin_courses";
const LESSONS_KEY = "fedoraquest_admin_lessons";
const QUIZZES_KEY = "fedoraquest_admin_quizzes";
const ACHIEVEMENTS_KEY = "fedoraquest_admin_achievements";
const CERT_TEMPLATE_KEY = "fedoraquest_admin_certificateTemplate";
const SETTINGS_KEY = "fedoraquest_admin_settings";

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

function readOrSeed(key, seedFn) {
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);

  const seeded = seedFn();
  localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function nextId(records) {
  return records.reduce((max, record) => Math.max(max, record.id), 0) + 1;
}

// --- Courses (staged from data/modules.js) ---

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

export function getCourses() {
  return readOrSeed(COURSES_KEY, seedCourses);
}

export function createCourse(course) {
  const courses = getCourses();
  const newCourse = {
    id: nextId(courses),
    title: "",
    description: "",
    difficulty: "Beginner",
    estimatedDuration: "",
    thumbnailUrl: "",
    published: false,
    ...course,
  };
  write(COURSES_KEY, [...courses, newCourse]);
  return newCourse;
}

export function updateCourse(id, updates) {
  const courses = getCourses().map((course) =>
    course.id === id ? { ...course, ...updates } : course
  );
  write(COURSES_KEY, courses);
  return courses.find((course) => course.id === id);
}

export function deleteCourse(id) {
  write(COURSES_KEY, getCourses().filter((course) => course.id !== id));
}

export function reorderCourses(orderedIds) {
  const courses = getCourses();
  const reordered = orderedIds
    .map((id) => courses.find((course) => course.id === id))
    .filter(Boolean);
  write(COURSES_KEY, reordered);
  return reordered;
}

// --- Lessons (staged from data/lessons.js, flat list across all courses) ---

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

export function getLessons() {
  return readOrSeed(LESSONS_KEY, seedLessons);
}

export function createLesson(lesson) {
  const lessons = getLessons();
  const newLesson = {
    id: nextId(lessons),
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
  write(LESSONS_KEY, [...lessons, newLesson]);
  return newLesson;
}

export function updateLesson(id, updates) {
  const lessons = getLessons().map((lesson) =>
    lesson.id === id ? { ...lesson, ...updates } : lesson
  );
  write(LESSONS_KEY, lessons);
  return lessons.find((lesson) => lesson.id === id);
}

export function deleteLesson(id) {
  write(LESSONS_KEY, getLessons().filter((lesson) => lesson.id !== id));
}

export function reorderLessons(orderedIds) {
  const lessons = getLessons();
  const reordered = orderedIds
    .map((id) => lessons.find((lesson) => lesson.id === id))
    .filter(Boolean);
  write(LESSONS_KEY, reordered);
  return reordered;
}

// --- Quizzes (staged from data/quizzes/index.js) ---

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

export function getQuizzes() {
  return readOrSeed(QUIZZES_KEY, seedQuizzes);
}

export function createQuiz(quiz) {
  const quizzes = getQuizzes();
  const newQuiz = {
    id: nextId(quizzes),
    lessonId: null,
    title: "",
    difficulty: "beginner",
    passingScore: DEFAULT_SETTINGS.defaultPassingScore,
    timeLimitSeconds: null,
    published: false,
    questions: [],
    ...quiz,
  };
  write(QUIZZES_KEY, [...quizzes, newQuiz]);
  return newQuiz;
}

export function updateQuiz(id, updates) {
  const quizzes = getQuizzes().map((quiz) =>
    quiz.id === id ? { ...quiz, ...updates } : quiz
  );
  write(QUIZZES_KEY, quizzes);
  return quizzes.find((quiz) => quiz.id === id);
}

export function deleteQuiz(id) {
  write(QUIZZES_KEY, getQuizzes().filter((quiz) => quiz.id !== id));
}

// --- Achievements (staged from data/achievements.js) ---

function seedAchievements() {
  return achievementsData.map((achievement) => ({ ...achievement }));
}

export function getAdminAchievements() {
  return readOrSeed(ACHIEVEMENTS_KEY, seedAchievements);
}

export function createAchievement(achievement) {
  const achievements = getAdminAchievements();
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
  write(ACHIEVEMENTS_KEY, [...achievements, newAchievement]);
  return newAchievement;
}

export function updateAchievement(id, updates) {
  const achievements = getAdminAchievements().map((achievement) =>
    achievement.id === id ? { ...achievement, ...updates } : achievement
  );
  write(ACHIEVEMENTS_KEY, achievements);
  return achievements.find((achievement) => achievement.id === id);
}

export function deleteAchievement(id) {
  write(
    ACHIEVEMENTS_KEY,
    getAdminAchievements().filter((achievement) => achievement.id !== id)
  );
}

// --- Certificate template ---

export function getCertificateTemplate() {
  const saved = localStorage.getItem(CERT_TEMPLATE_KEY);
  return saved ? JSON.parse(saved) : DEFAULT_CERTIFICATE_TEMPLATE;
}

export function updateCertificateTemplate(updates) {
  const updated = { ...getCertificateTemplate(), ...updates };
  write(CERT_TEMPLATE_KEY, updated);
  return updated;
}

// --- Platform settings ---

export function getSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (!saved) return DEFAULT_SETTINGS;

  const parsed = JSON.parse(saved);
  return {
    ...DEFAULT_SETTINGS,
    ...parsed,
    featureToggles: {
      ...DEFAULT_SETTINGS.featureToggles,
      ...parsed.featureToggles,
    },
  };
}

export function updateSettings(updates) {
  const updated = { ...getSettings(), ...updates };
  write(SETTINGS_KEY, updated);
  return updated;
}

export function resetAllStagedContent() {
  localStorage.removeItem(COURSES_KEY);
  localStorage.removeItem(LESSONS_KEY);
  localStorage.removeItem(QUIZZES_KEY);
  localStorage.removeItem(ACHIEVEMENTS_KEY);
}
