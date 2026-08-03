// Achievement catalog. `category` drives the Achievements page's filter
// pills. `xpReward` is awarded automatically by GameContext.unlockAchievement
// the first time an achievement unlocks. `progressKey`/`progressTarget`
// are optional — when present, the Achievements page shows a progress bar
// by looking up `progressKey` in the stats object useAchievements builds.
//
// A few items from the original suggested list were deliberately left out
// rather than faked:
// - "First Course Completed" / "5 Courses Completed" / "10 Courses
//   Completed" — this app has exactly one course; "first" is course_complete
//   below, and "5/10" could never unlock since there's structurally only
//   ever one course to complete.
// - "Complete First Project" / "Complete All Beginner Projects" — there is
//   no Projects feature anywhere in this app.
//
// "Help Another Learner" / "Forum Contributor" are kept as real catalog
// entries (so the UI/architecture is ready) but have no unlock condition
// wired up anywhere — there's no community feature to trigger them yet.

const achievements = [
  // --- Learning ---
  {
    id: "first_lesson",
    title: "First Lesson",
    description: "Complete your first lesson.",
    icon: "🏅",
    category: "Learning",
    xpReward: 25,
  },
  {
    id: "five_lessons",
    title: "Learning Momentum",
    description: "Complete 5 lessons.",
    icon: "🚀",
    category: "Learning",
    xpReward: 50,
    progressKey: "completedLessonsCount",
    progressTarget: 5,
  },
  {
    id: "ten_lessons",
    title: "Linux Explorer",
    description: "Complete 10 lessons.",
    icon: "🐧",
    category: "Learning",
    xpReward: 75,
    progressKey: "completedLessonsCount",
    progressTarget: 10,
  },
  {
    id: "first_module",
    title: "Module Master",
    description: "Complete your first module.",
    icon: "📘",
    category: "Learning",
    xpReward: 50,
  },
  {
    id: "course_complete",
    title: "Fedora Master",
    description: "Complete the entire FedoraQuest course.",
    icon: "🎓",
    category: "Learning",
    xpReward: 150,
  },

  // --- Quizzes ---
  {
    id: "first_quiz",
    title: "First Quiz",
    description: "Complete your first quiz.",
    icon: "📝",
    category: "Quizzes",
    xpReward: 25,
  },
  {
    id: "perfect_score",
    title: "Perfect Score",
    description: "Score 100% on any quiz.",
    icon: "💯",
    category: "Quizzes",
    xpReward: 75,
  },
  {
    id: "ten_quizzes_passed",
    title: "Quiz Regular",
    description: "Pass 10 quizzes.",
    icon: "✅",
    category: "Quizzes",
    xpReward: 50,
    progressKey: "quizzesPassedCount",
    progressTarget: 10,
  },
  {
    id: "quiz_master",
    title: "Quiz Master",
    description: "Pass every available quiz.",
    icon: "🧠",
    category: "Quizzes",
    xpReward: 75,
  },
  {
    id: "hundred_questions",
    title: "Centurion",
    description: "Answer 100 quiz questions.",
    icon: "🔢",
    category: "Quizzes",
    xpReward: 75,
    progressKey: "questionsAnsweredCount",
    progressTarget: 100,
  },
  {
    id: "course_expert",
    title: "Course Expert",
    description: "Pass every quiz with an average score of 90% or higher.",
    icon: "🎯",
    category: "Quizzes",
    xpReward: 150,
  },

  // --- XP ---
  {
    id: "xp_100",
    title: "Getting Started",
    description: "Earn 100 XP.",
    icon: "⭐",
    category: "XP",
    xpReward: 25,
    progressKey: "xp",
    progressTarget: 100,
  },
  {
    id: "xp_500",
    title: "Rising Star",
    description: "Reach 500 XP.",
    icon: "✨",
    category: "XP",
    xpReward: 50,
    progressKey: "xp",
    progressTarget: 500,
  },
  {
    id: "xp_1000",
    title: "XP Collector",
    description: "Reach 1,000 XP.",
    icon: "🌟",
    category: "XP",
    xpReward: 75,
    progressKey: "xp",
    progressTarget: 1000,
  },
  {
    id: "xp_champion",
    title: "Fedora Champion",
    description: "Reach 5,000 XP — the maximum level.",
    icon: "👑",
    category: "XP",
    xpReward: 150,
    progressKey: "xp",
    progressTarget: 5000,
  },

  // --- Streaks ---
  {
    id: "streak_3",
    title: "Warming Up",
    description: "Reach a 3-day study streak.",
    icon: "🔥",
    category: "Streaks",
    xpReward: 25,
    progressKey: "streak",
    progressTarget: 3,
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "Reach a 7-day study streak.",
    icon: "🔥",
    category: "Streaks",
    xpReward: 50,
    progressKey: "streak",
    progressTarget: 7,
  },
  {
    id: "streak_30",
    title: "Unstoppable",
    description: "Reach a 30-day study streak.",
    icon: "🏆",
    category: "Streaks",
    xpReward: 75,
    progressKey: "streak",
    progressTarget: 30,
  },
  {
    id: "streak_100",
    title: "Century Streak",
    description: "Reach a 100-day study streak.",
    icon: "💎",
    category: "Streaks",
    xpReward: 150,
    progressKey: "streak",
    progressTarget: 100,
  },

  // --- Labs ---
  {
    id: "first_lab",
    title: "First Lab",
    description: "Complete your first hands-on lab.",
    icon: "🧪",
    category: "Labs",
    xpReward: 25,
  },
  {
    id: "ten_labs",
    title: "Lab Regular",
    description: "Complete 10 labs.",
    icon: "🔬",
    category: "Labs",
    xpReward: 50,
    progressKey: "completedLabsCount",
    progressTarget: 10,
  },
  {
    id: "lab_expert",
    title: "Linux Lab Expert",
    description: "Complete every available lab.",
    icon: "🥼",
    category: "Labs",
    xpReward: 100,
    progressKey: "completedLabsCount",
    progressTarget: 24,
  },

  // --- Commands ---
  {
    id: "hundred_commands",
    title: "Command Runner",
    description: "Execute 100 commands in the terminal simulator.",
    icon: "⌨️",
    category: "Commands",
    xpReward: 50,
    progressKey: "commandsExecutedCount",
    progressTarget: 100,
  },
  {
    id: "terminal_expert",
    title: "Terminal Expert",
    description: "Use every supported terminal command at least once.",
    icon: "💻",
    category: "Commands",
    xpReward: 75,
    progressKey: "uniqueCommandsUsedCount",
    progressTarget: 12,
  },

  // --- Community (future-ready; no unlock condition wired up yet) ---
  {
    id: "help_learner",
    title: "Help Another Learner",
    description: "Help a fellow learner in the community.",
    icon: "🤝",
    category: "Community",
    xpReward: 50,
  },
  {
    id: "forum_contributor",
    title: "Forum Contributor",
    description: "Contribute to the FedoraQuest community forum.",
    icon: "💬",
    category: "Community",
    xpReward: 50,
  },
];

export default achievements;
