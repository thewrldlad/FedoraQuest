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

  2: {
    estimatedTime: "60–75 minutes",

    objectives: [
      "Create directories and nested directory structures using mkdir",
      "Remove empty directories safely using rmdir",
      "Create empty files and update file timestamps using touch",
      "Duplicate files and directories using cp, including recursive copies",
      "Move and rename files and directories using mv",
      "Delete files and directories using rm, understanding that the action is permanent",
      "Visualize a directory structure using tree, and know how to install it on Fedora",
      "Recognize why file management commands carry more risk than navigation commands",
    ],

    introduction:
      "Day 1 taught you how to move around the filesystem without changing anything. Day 2 introduces the commands that actually shape it — creating project folders, duplicating files for backup, reorganizing downloads, and cleaning up what you no longer need. These commands are where Linux administration becomes genuinely productive, and also where a single mistyped command can do real, permanent damage. Understanding both the power and the risk of these tools is the point of this lesson.",

    coreConcepts:
      "On Linux, almost everything is represented as a file: regular documents, directories, and even devices are accessed through the same filesystem tree you navigated in Day 1. File management commands operate directly on that tree — they don't go through any intermediate safety layer.\n\nThis matters because, unlike a graphical file manager, none of the commands in this lesson use a Trash or Recycle Bin by default. When you remove something with rm, it is unlinked from the filesystem immediately; there is no 'restore from trash' step afterward. This isn't a flaw — it's a deliberate design choice that keeps these tools fast, scriptable, and predictable — but it means the responsibility for caution shifts entirely to you, the operator.\n\nA second core idea is the distinction between creating structure (mkdir, touch) and manipulating existing content (cp, mv, rm). Commands that create things are inherently low-risk: at worst, you create something you didn't need. Commands that copy, move, or remove existing content are higher-risk, because they can overwrite or destroy data that already exists. Keeping this distinction in mind will guide how carefully you should double-check a command before running it.",

    commandSyntax: [
      "pwd [OPTION]",
      "ls [OPTION]... [FILE]...",
      "cd [DIRECTORY]",
      "mkdir [OPTION]... DIRECTORY...",
      "rmdir [OPTION]... DIRECTORY...",
      "touch [OPTION]... FILE...",
      "cp [OPTION]... SOURCE DEST",
      "mv [OPTION]... SOURCE DEST",
      "rm [OPTION]... FILE...",
      "tree [OPTION]... [DIRECTORY]",
    ],

    commandBreakdown: [
      {
        command: "pwd / ls / cd (recap from Day 1)",
        options: [
          { flag: "pwd", effect: "Prints your current location; used throughout this lesson to confirm where a command will act" },
          { flag: "ls -l", effect: "Long listing, useful here for confirming a file was actually created, copied, or removed" },
          { flag: "cd", effect: "Moves you into the directory you're about to manage" },
        ],
      },
      {
        command: "mkdir",
        options: [
          { flag: "(none)", effect: "Creates the named directory; fails if it already exists or its parent doesn't exist" },
          { flag: "-p", effect: "Creates any missing parent directories along the way, and does not error if the directory already exists" },
          { flag: "-v", effect: "Prints a message for each directory created" },
        ],
      },
      {
        command: "rmdir",
        options: [
          { flag: "(none)", effect: "Removes the named directory only if it is completely empty" },
          { flag: "-p", effect: "Also removes now-empty parent directories after removing the target" },
        ],
      },
      {
        command: "touch",
        options: [
          { flag: "(none)", effect: "Creates an empty file if it doesn't exist, or updates its modification timestamp to now if it does" },
          { flag: "-d STRING", effect: "Sets a specific timestamp instead of the current time" },
        ],
      },
      {
        command: "cp",
        options: [
          { flag: "(none)", effect: "Copies a file to a new location or name; fails on directories without -r" },
          { flag: "-r / -R", effect: "Recursively copies a directory and everything inside it" },
          { flag: "-i", effect: "Prompts for confirmation before overwriting an existing destination file" },
          { flag: "-v", effect: "Prints each file as it is copied" },
        ],
      },
      {
        command: "mv",
        options: [
          { flag: "(none)", effect: "Moves a file or directory to a new location, or renames it if the destination is in the same directory" },
          { flag: "-i", effect: "Prompts for confirmation before overwriting an existing destination file" },
          { flag: "-v", effect: "Prints each file as it is moved" },
        ],
      },
      {
        command: "rm",
        options: [
          { flag: "(none)", effect: "Removes the named file(s) permanently — there is no trash to recover from" },
          { flag: "-r", effect: "Recursively removes a directory and everything inside it" },
          { flag: "-i", effect: "Prompts for confirmation before each removal" },
          { flag: "-f", effect: "Forces removal without prompting and suppresses errors for missing files — use with particular caution" },
        ],
      },
      {
        command: "tree",
        options: [
          { flag: "(none)", effect: "Displays the directory structure starting at the current (or given) directory as a visual tree" },
          { flag: "-L N", effect: "Limits the tree to N levels of depth" },
          { flag: "-a", effect: "Includes hidden files and directories in the tree" },
        ],
      },
    ],

    practicalExamples: `[alice@fedora ~]$ mkdir Projects/quest-notes
[alice@fedora ~]$ cd Projects/quest-notes
[alice@fedora quest-notes]$ touch todo.txt readme.md
[alice@fedora quest-notes]$ ls -l
total 0
-rw-r--r--. 1 alice alice 0 Aug  3 09:40 readme.md
-rw-r--r--. 1 alice alice 0 Aug  3 09:40 todo.txt

[alice@fedora quest-notes]$ cp todo.txt todo.bak.txt
[alice@fedora quest-notes]$ mv todo.bak.txt ../../Documents/
[alice@fedora quest-notes]$ ls ../../Documents
todo.bak.txt

[alice@fedora quest-notes]$ cd ..
[alice@fedora Projects]$ tree
.
└── quest-notes
    ├── readme.md
    └── todo.txt

1 directory, 2 files

[alice@fedora Projects]$ rm quest-notes/readme.md
[alice@fedora Projects]$ rmdir quest-notes
rmdir: failed to remove 'quest-notes': Directory not empty
[alice@fedora Projects]$ rm -r quest-notes`,

    fedoraNotes: [
      "tree is not installed by default on Fedora Workstation or Server. Install it with: sudo dnf install tree. Until it's installed, ls -R provides a rougher but always-available recursive listing.",
      "GNU coreutils (the same cp, mv, rm implementations documented here) are Fedora's default toolset — behavior is consistent across Fedora releases and matches what's documented in the GNU Coreutils Manual.",
      "There is no CLI-level Trash by default. GNOME Files (Nautilus) has its own graphical trash, but files removed with rm in the terminal bypass it entirely and are not recoverable through the desktop's Trash folder.",
      "cp -a (archive mode) preserves permissions, timestamps, and — on SELinux-enabled systems like Fedora — as much of the security context as possible, which plain cp does not guarantee.",
    ],

    realWorldScenarios: [
      "Scaffolding a new project: mkdir followed by touch to lay out an initial directory and starter files before writing any real code.",
      "Safety copies before risky edits: cp config.conf config.conf.bak before modifying a configuration file, so the original can be restored if something breaks.",
      "Reorganizing downloads: using mv to sort files out of ~/Downloads into the appropriate project or media directory.",
      "Cleaning up build artifacts: rm -r used to delete generated output directories (e.g. a build/ or dist/ folder) before a fresh build.",
      "Onboarding a teammate: running tree on a project directory to quickly show its structure instead of describing it verbally.",
    ],

    commonMistakes: [
      "Forgetting -p with mkdir when creating a nested path whose parent doesn't exist yet, resulting in 'No such file or directory'.",
      "Trying to rmdir a directory that still contains files instead of using rm -r.",
      "Running rm -rf without first confirming pwd and the exact target path — there is no undo.",
      "Forgetting cp requires -r to copy a directory, and getting an 'omitting directory' error.",
      "Using mv or cp without -i and unknowingly overwriting a file that already existed at the destination.",
      "Assuming touch can create directories — it only creates or updates files.",
    ],

    bestPractices: [
      "Always confirm pwd and the exact target path before running rm, especially with -r or -f.",
      "Prefer rm -i while you're still building confidence with destructive commands.",
      "Use the -v flag on cp and mv during scripted or bulk operations, so you have a visible record of what happened.",
      "Use mkdir -p to safely create nested directory structures in a single command.",
      "Run tree (or ls -R) before and after a significant reorganization to visually confirm the result matches your intent.",
    ],

    handsOnLab: {
      steps: [
        "Navigate into ~/Projects.",
        "Create a new directory named quest-notes inside it.",
        "Move into quest-notes and create a file named todo.txt with touch.",
        "Make a backup copy of todo.txt named todo.bak.txt using cp.",
        "Move todo.bak.txt into ~/Documents using mv.",
        "Confirm the result with ls in both ~/Projects/quest-notes and ~/Documents.",
      ],
      goal:
        "Finish the lab with todo.txt still inside ~/Projects/quest-notes, and todo.bak.txt relocated into ~/Documents.",
    },

    challengeExercise:
      "Inside ~/Pictures, create a directory named archive. Create two empty files named photo1.txt and photo2.txt directly inside ~/Pictures, then move both of them into the new archive directory in as few commands as possible. Finish by listing archive to confirm both files arrived. (Note: the in-app terminal simulator doesn't yet support tree — if you have access to a real Fedora system or the Fedora installation media, try installing it with sudo dnf install tree and running it against a real project directory to see the full visual output.)",

    summary:
      "File and directory management turns the filesystem from something you merely observe into something you actively shape: mkdir and touch create structure, cp and mv reorganize it, and rm removes it — permanently, with no built-in undo. tree (once installed) gives you a fast visual sanity check of the result. The recurring theme across this lesson's best practices is the same one: these commands are powerful specifically because they act immediately and without confirmation by default, so the habit of verifying before you execute is what separates confident Linux use from costly accidents.",

    furtherReading: [
      { title: "GNU Coreutils Manual", detail: "Reference entries for mkdir, rmdir, touch, cp, mv, rm" },
      { title: "Fedora Docs", detail: "Quick Docs on managing files and directories from the command line" },
      { title: "Red Hat Customer Portal Documentation", detail: "System Administrator's Guide, file and directory management" },
      { title: "Linux Foundation resources", detail: "Introductory materials on core file management commands and safe usage patterns" },
      { title: "man mkdir, man cp, man mv, man rm, man tree", detail: "Available locally on any Fedora installation; install tree first via sudo dnf install tree" },
    ],
  },
};

export default lessonContent;
