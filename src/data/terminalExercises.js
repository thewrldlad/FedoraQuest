// Terminal exercises, keyed by lab id (data/labs.js).
// Kept separate from the command engine (utils/terminalFileSystem.js) so
// new exercises can be added without touching command implementations.
//
// checkGoal receives { fs, cwd, history } after every command run in the
// Terminal and returns true once the exercise objective is met.

const terminalExercises = {
  1: {
    prompt:
      "Navigate into ~/Documents, then confirm your location with pwd.",
    checkGoal: ({ cwd }) => cwd.length === 1 && cwd[0] === "Documents",
  },
  3: {
    prompt:
      "Create a new directory named 'notes' inside ~/Documents.",
    checkGoal: ({ fs }) => {
      const documents = fs.children.Documents;
      return Boolean(
        documents &&
          documents.children.notes &&
          documents.children.notes.type === "dir"
      );
    },
  },
};

export default terminalExercises;
