// Rich, structured lesson content, keyed by lesson id (data/modules.js).
// Kept separate from modules.js so the lightweight lesson index used by
// Course.jsx, RoadmapCard, Dashboard, and achievement checks stays small.
// Lessons without an entry here fall back to their plain `description`
// in pages/Lesson.jsx.

const lessonContent = {
  1: {
    estimatedTime: "45–60 minutes",

    objectives: [
      "Explain the relationship between a shell, a terminal emulator, and the Linux kernel",
      "Determine your current location in the filesystem using pwd",
      "List directory contents — including hidden files — using ls and interpret its output",
      "Navigate the filesystem using cd with absolute paths, relative paths, and shorthand notations",
      "Distinguish the Filesystem Hierarchy Standard (FHS) layout used by Fedora from ad-hoc directory structures",
      "Apply efficient navigation habits used by professional Linux administrators",
    ],

    introduction:
      "Every interaction you have with a Fedora system beyond its graphical desktop happens through a shell. Whether you're troubleshooting a failed service over SSH, automating a deployment, or inspecting a configuration file, the first skill you rely on — every single time — is knowing where you are and how to get somewhere else. This is why terminal navigation is lesson one in essentially every professional Linux curriculum: it's not busywork, it's the substrate everything else is built on. Get comfortable here, and every later lesson moves faster.",

    coreConcepts:
      "A terminal emulator (e.g. GNOME Terminal, Konsole) is just a window that displays text input and output. The program actually interpreting what you type is the shell — on Fedora, this is bash by default. The shell parses your input, resolves it to a program or builtin, and asks the Linux kernel to execute it.\n\nFedora organizes all storage into a single tree rooted at /, following the Filesystem Hierarchy Standard (FHS) used by most major Linux distributions. Key top-level directories include /home (personal user directories), /etc (system-wide configuration), /var (variable data such as logs), and /usr (installed software and shared resources).\n\nAt any moment, your shell has a current working directory — the location relative commands are interpreted from. Every user also has a home directory (typically /home/<username>), referenced by the shorthand ~.\n\nPaths come in two forms: an absolute path begins at / and is unambiguous regardless of where you currently are (e.g. /home/alice/Documents); a relative path is interpreted relative to your current location (e.g. Documents or ../Downloads).\n\nYour prompt encodes this context. A standard Fedora prompt, [alice@fedora ~]$, reads as: user alice, host fedora, current directory ~ (home), with a $ denoting a regular user — a # would indicate root.",

    commandSyntax: [
      "pwd [OPTION]",
      "ls [OPTION]... [FILE]...",
      "cd [DIRECTORY]",
    ],

    commandBreakdown: [
      {
        command: "pwd",
        options: [
          { flag: "(none)", effect: "Prints the current directory as tracked by the shell" },
          { flag: "-P", effect: "Resolves and prints the physical path, following symbolic links" },
        ],
      },
      {
        command: "ls",
        options: [
          { flag: "(none)", effect: "Lists visible entries in the current directory" },
          { flag: "-a", effect: "Includes hidden entries (names beginning with .)" },
          { flag: "-l", effect: "Long listing: permissions, link count, owner, group, size, modification time" },
          { flag: "-h", effect: "Human-readable sizes when combined with -l" },
          { flag: "-R", effect: "Recurses into subdirectories" },
        ],
      },
      {
        command: "cd",
        options: [
          { flag: "(none)", effect: "Returns to the invoking user's home directory" },
          { flag: "~", effect: "Home directory shorthand" },
          { flag: "-", effect: "Switches to the previous working directory" },
          { flag: "..", effect: "Moves to the parent directory" },
          { flag: ".", effect: "Refers to the current directory" },
          { flag: "/abs/path", effect: "Absolute path navigation" },
          { flag: "rel/path", effect: "Relative path navigation from the current directory" },
        ],
      },
    ],

    practicalExamples: `[alice@fedora ~]$ pwd
/home/alice

[alice@fedora ~]$ ls -lh
total 16K
drwxr-xr-x. 2 alice alice 4.0K Aug  1 10:30 Documents
drwxr-xr-x. 2 alice alice 4.0K Aug  1 10:30 Downloads
drwxr-xr-x. 2 alice alice 4.0K Aug  1 10:30 Pictures
drwxr-xr-x. 2 alice alice 4.0K Aug  1 10:30 Projects

[alice@fedora ~]$ cd Documents
[alice@fedora Documents]$ pwd
/home/alice/Documents

[alice@fedora Documents]$ cd ..
[alice@fedora ~]$ cd -
/home/alice/Documents

[alice@fedora Documents]$ cd
[alice@fedora ~]$`,

    fedoraNotes: [
      "Fedora enables SELinux by default in enforcing mode. This doesn't change how you navigate directories, but some directories carry security contexts in addition to standard permissions — visible later with ls -Z, a flag not present on distributions without SELinux.",
      "Fedora's default shell and prompt styling (via PS1 in /etc/bashrc) already includes the [user@host dir]$ format shown in this lesson — no configuration is needed.",
      "Fedora ships GNU coreutils (the same ls, cd, pwd implementations referenced here) rather than BusyBox variants found on some minimal or embedded distributions, so all flags described behave exactly as documented.",
    ],

    realWorldScenarios: [
      "Incident response: an administrator SSHs into a Fedora server with no GUI available and must navigate to /var/log to inspect logs for a failing service — terminal navigation is the only option here.",
      "Configuration management: locating and editing a service's configuration typically means navigating to /etc/<service-name>/.",
      "Multi-project development: a developer switches repeatedly between ~/Projects/client-a and ~/Projects/client-b, using cd - to avoid retyping full paths.",
    ],

    commonMistakes: [
      "Assuming a directory is empty because hidden dotfiles (like .bashrc) don't appear without -a.",
      "Running a relative-path command from the wrong working directory and getting 'No such file or directory'.",
      "Forgetting that Linux paths are case-sensitive — Documents and documents are distinct.",
      "Failing to quote or escape paths containing spaces (cd My Folder fails; cd \"My Folder\" succeeds).",
      "Not verifying pwd before running a command whose effect depends on location — especially a destructive one.",
    ],

    bestPractices: [
      "Use Tab completion as a default habit — it prevents typos and confirms a path exists before you commit to it.",
      "Check pwd before any location-sensitive or destructive operation.",
      "Use cd - to toggle rapidly between two directories in active use.",
      "Default to ls -la when entering an unfamiliar directory, since hidden configuration files are common.",
      "In scripts, prefer absolute paths for reliability; in interactive use, prefer relative paths and shortcuts for speed.",
    ],

    handsOnLab: {
      steps: [
        "Run pwd and confirm you start at ~.",
        "Run ls to view the four starting directories.",
        "Navigate into ~/Documents with cd Documents, then confirm with pwd.",
        "Return to ~ using cd .., then confirm with pwd.",
        "Navigate directly into ~/Projects using cd ~/Projects.",
        "Use cd - to return to ~/Documents without retyping the path.",
      ],
      goal:
        "Finish the lab inside ~/Documents, having visited both ~/Documents and ~/Projects along the way.",
    },

    challengeExercise:
      "Visit all four simulated directories (Documents, Downloads, Projects, Pictures) in a single session, confirming your location with pwd immediately after each move, then return to ~ using cd with no arguments — without ever needing to type a full path more than once.",

    summary:
      "Navigation rests on three commands — pwd, ls, cd — and two ideas: knowing where you are, and knowing how to describe where you want to go, whether absolutely from / or relatively from here. Fluency with ~, .., -, and Tab completion is what separates comfortable Linux use from constant friction, and the habits introduced here will resurface throughout this course.",

    furtherReading: [
      { title: "GNU Coreutils Manual", detail: "Reference entries for ls, cd, pwd" },
      { title: "Bash Reference Manual", detail: "Bourne Shell Builtins section, covering cd and pwd" },
      { title: "Fedora Docs", detail: "Quick Docs on the filesystem and basic command-line usage" },
      { title: "Red Hat Customer Portal Documentation", detail: "System Administrator's Guide, filesystem navigation and FHS overview" },
      { title: "man pwd, man ls, man cd", detail: "Available locally on any Fedora installation (help cd for the bash builtin)" },
    ],
  },
};

export default lessonContent;
