// Quiz for lesson 2 (File & Directory Management). Timed (5 minutes) so
// both the timed and untimed QuizPlayer paths are exercised for real
// somewhere in the app.

const filesystemQuiz = {
  lessonId: 2,
  difficulty: "beginner",
  passingScore: 70,
  timeLimitSeconds: 300,
  questions: [
    {
      id: 1,
      type: "single",
      question:
        "Which command creates a new empty file, or updates its timestamp if it already exists?",
      options: ["mkdir", "touch", "cp", "rm"],
      correctAnswers: [1],
      explanation:
        "touch creates the file if it's missing, or just updates its modification time if it already exists.",
    },
    {
      id: 2,
      type: "single",
      question:
        "Which mkdir flag lets you create nested parent directories in a single command?",
      options: ["-v", "-r", "-p", "-a"],
      correctAnswers: [2],
      explanation:
        "-p (parents) creates any missing intermediate directories along the path instead of failing.",
    },
    {
      id: 3,
      type: "boolean",
      question: "rmdir can remove a directory that still contains files.",
      options: ["True", "False"],
      correctAnswers: [1],
      explanation:
        "rmdir only removes empty directories; you need rm -r to remove a directory and its contents.",
    },
    {
      id: 4,
      type: "single",
      question:
        "Which command is required to copy a directory and everything inside it?",
      options: ["cp", "cp -r", "mv", "touch"],
      correctAnswers: [1],
      explanation:
        "Plain cp refuses to copy directories; the -r (recursive) flag is required to copy a directory tree.",
    },
    {
      id: 5,
      type: "single",
      question:
        "Why is rm considered riskier than deleting a file through a graphical file manager?",
      options: [
        "It only works on directories",
        "It requires root privileges every time",
        "It deletes immediately with no trash/recycle bin to recover from",
        "It cannot be undone with Ctrl+Z in any application",
      ],
      correctAnswers: [2],
      explanation:
        "Unlike a desktop's Trash, rm unlinks the file immediately and permanently — there's no recovery step.",
    },
  ],
};

export default filesystemQuiz;
