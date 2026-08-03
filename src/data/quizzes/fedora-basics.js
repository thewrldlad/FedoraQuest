// Quiz for lesson 1 (Terminal Navigation). Kept as its own topic file so
// new quizzes can be added without touching any component — see index.js.

const fedoraBasicsQuiz = {
  lessonId: 1,
  difficulty: "beginner",
  passingScore: 70,
  timeLimitSeconds: null, // untimed
  questions: [
    {
      id: 1,
      type: "single",
      question: "Which command displays your current working directory?",
      options: ["ls", "pwd", "cd", "whoami"],
      correctAnswers: [1],
      explanation:
        "pwd (print working directory) prints the absolute path of your current location in the filesystem.",
    },
    {
      id: 2,
      type: "single",
      question: "What does `cd -` do?",
      options: [
        "Moves to the root directory",
        "Moves to the parent directory",
        "Returns you to the previous working directory",
        "Clears the terminal",
      ],
      correctAnswers: [2],
      explanation:
        "The shell remembers your last working directory in $OLDPWD, and `cd -` switches back to it.",
    },
    {
      id: 3,
      type: "boolean",
      question:
        "Documents and documents refer to the same directory on Fedora.",
      options: ["True", "False"],
      correctAnswers: [1],
      explanation:
        "Linux filesystems are case-sensitive, so Documents and documents are two entirely different names.",
    },
    {
      id: 4,
      type: "single",
      question: "Which ls flag reveals hidden files?",
      options: ["-l", "-R", "-a", "-h"],
      correctAnswers: [2],
      explanation:
        "-a (all) includes entries whose names begin with a dot, which ls hides by default.",
    },
    {
      id: 5,
      type: "single",
      question:
        "Why might a script that uses relative paths behave unpredictably?",
      options: [
        "Relative paths are slower to resolve",
        "Its behavior depends on the working directory it's invoked from",
        "Relative paths don't work in Bash",
        "cd cannot be used in scripts",
      ],
      correctAnswers: [1],
      explanation:
        "A relative path is resolved against whatever the current working directory happens to be at runtime, which can vary depending on how the script was invoked.",
    },
  ],
};

export default fedoraBasicsQuiz;
