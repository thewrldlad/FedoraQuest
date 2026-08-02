// Quiz data, keyed by lesson id. Kept separate from lessons/modules data.
//
// Question types:
// - "single"   : one correct option
// - "boolean"  : True/False, one correct option
// - "multiple" : more than one correct option (architecture supported,
//                not yet used by any seeded quiz)
//
// `correctAnswers` is always an array of option indices so single,
// boolean, and multiple-select questions can share the same scoring logic.

const quizzes = {
  1: {
    passingScore: 70,
    questions: [
      {
        id: 1,
        type: "single",
        question: "Which command displays your current working directory?",
        options: ["ls", "pwd", "cd", "whoami"],
        correctAnswers: [1],
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
      },
      {
        id: 3,
        type: "boolean",
        question:
          "Documents and documents refer to the same directory on Fedora.",
        options: ["True", "False"],
        correctAnswers: [1],
      },
      {
        id: 4,
        type: "single",
        question: "Which ls flag reveals hidden files?",
        options: ["-l", "-R", "-a", "-h"],
        correctAnswers: [2],
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
      },
    ],
  },
  2: {
    passingScore: 70,
    questions: [
      {
        id: 1,
        type: "boolean",
        question:
          "The shell is the program that interprets and executes the commands you type.",
        options: ["True", "False"],
        correctAnswers: [0],
      },
      {
        id: 2,
        type: "single",
        question: "What is Bash?",
        options: [
          "A file manager",
          "A common Linux shell",
          "A text editor",
          "A package manager",
        ],
        correctAnswers: [1],
      },
      {
        id: 3,
        type: "single",
        question:
          "Which symbol typically indicates the shell prompt for a regular user?",
        options: ["#", "$", "%", "&"],
        correctAnswers: [1],
      },
      {
        id: 4,
        type: "boolean",
        question: "Every Linux distribution uses the exact same default shell.",
        options: ["True", "False"],
        correctAnswers: [1],
      },
    ],
  },
  3: {
    passingScore: 70,
    questions: [
      {
        id: 1,
        type: "single",
        question: "Which command opens the manual page for `ls`?",
        options: ["ls --manual", "man ls", "help ls", "ls -help"],
        correctAnswers: [1],
      },
      {
        id: 2,
        type: "boolean",
        question:
          "--help is a common flag supported by many Linux commands to show brief usage info.",
        options: ["True", "False"],
        correctAnswers: [0],
      },
      {
        id: 3,
        type: "single",
        question:
          "Which command provides an alternative, often more detailed help format to man pages?",
        options: ["info", "cat", "find", "which"],
        correctAnswers: [0],
      },
      {
        id: 4,
        type: "boolean",
        question:
          "Man pages are organized into numbered sections (e.g. section 1 for commands, section 5 for file formats).",
        options: ["True", "False"],
        correctAnswers: [0],
      },
    ],
  },
};

export default quizzes;
