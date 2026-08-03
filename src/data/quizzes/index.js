import fedoraBasics from "./fedora-basics";
import filesystem from "./filesystem";

// Ready for future topics (e.g. dnf.js, permissions.js, terminal.js) —
// once those lessons have real content, import the file and add it to
// this array. No component needs to change.
const allQuizzes = [fedoraBasics, filesystem];

const quizzes = allQuizzes.reduce((map, quiz) => {
  map[quiz.lessonId] = quiz;
  return map;
}, {});

export default quizzes;
