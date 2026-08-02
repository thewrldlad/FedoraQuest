const labCategories = [
  {
    moduleId: 1,
    labs: [
      {
        id: 1,
        title: "Filesystem Navigation Drill",
        description:
          "Practice moving through directories using cd, ls, and pwd.",
        difficulty: "Beginner",
        estimatedTime: "15 min",
        xp: 50,
      },
      {
        id: 2,
        title: "Command Line Basics",
        description:
          "Practice running basic commands and reading their output.",
        difficulty: "Beginner",
        estimatedTime: "15 min",
        xp: 50,
      },
    ],
  },
  {
    moduleId: 2,
    labs: [
      {
        id: 3,
        title: "Create and Organize Files",
        description:
          "Practice creating, copying, and moving files and directories.",
        difficulty: "Beginner",
        estimatedTime: "20 min",
        xp: 50,
      },
      {
        id: 4,
        title: "Explore the FHS",
        description:
          "Practice exploring standard Linux system directories.",
        difficulty: "Beginner",
        estimatedTime: "20 min",
        xp: 50,
      },
    ],
  },
  {
    moduleId: 3,
    labs: [
      {
        id: 5,
        title: "Permission Basics",
        description:
          "Practice reading and interpreting file permission strings.",
        difficulty: "Beginner",
        estimatedTime: "20 min",
        xp: 50,
      },
      {
        id: 6,
        title: "chmod Practice",
        description:
          "Practice changing file permissions with chmod.",
        difficulty: "Beginner",
        estimatedTime: "20 min",
        xp: 50,
      },
    ],
  },
  {
    moduleId: 4,
    labs: [
      {
        id: 7,
        title: "User Management Drill",
        description:
          "Practice creating and managing user accounts.",
        difficulty: "Beginner",
        estimatedTime: "20 min",
        xp: 50,
      },
      {
        id: 8,
        title: "Group Management Drill",
        description:
          "Practice managing groups and group membership.",
        difficulty: "Beginner",
        estimatedTime: "20 min",
        xp: 50,
      },
    ],
  },
  {
    moduleId: 5,
    labs: [
      {
        id: 9,
        title: "Process Inspection",
        description:
          "Practice inspecting running processes with ps and top.",
        difficulty: "Intermediate",
        estimatedTime: "25 min",
        xp: 75,
      },
      {
        id: 10,
        title: "Process Control",
        description:
          "Practice stopping and signaling processes.",
        difficulty: "Intermediate",
        estimatedTime: "25 min",
        xp: 75,
      },
    ],
  },
  {
    moduleId: 6,
    labs: [
      {
        id: 11,
        title: "Network Diagnostics",
        description:
          "Practice diagnosing connectivity issues.",
        difficulty: "Intermediate",
        estimatedTime: "30 min",
        xp: 75,
      },
      {
        id: 12,
        title: "Firewall Configuration",
        description:
          "Practice managing firewalld zones and rules.",
        difficulty: "Intermediate",
        estimatedTime: "30 min",
        xp: 75,
      },
    ],
  },
  {
    moduleId: 7,
    labs: [
      {
        id: 13,
        title: "Script Fundamentals",
        description:
          "Practice writing and running a basic Bash script.",
        difficulty: "Intermediate",
        estimatedTime: "30 min",
        xp: 75,
      },
      {
        id: 14,
        title: "Conditional Logic Practice",
        description:
          "Practice using conditionals and loops in scripts.",
        difficulty: "Intermediate",
        estimatedTime: "30 min",
        xp: 75,
      },
    ],
  },
  {
    moduleId: 8,
    labs: [
      {
        id: 15,
        title: "DNF Practice",
        description:
          "Practice installing and removing packages with DNF.",
        difficulty: "Intermediate",
        estimatedTime: "25 min",
        xp: 75,
      },
      {
        id: 16,
        title: "Flatpak Practice",
        description:
          "Practice installing sandboxed apps with Flatpak.",
        difficulty: "Intermediate",
        estimatedTime: "25 min",
        xp: 75,
      },
    ],
  },
  {
    moduleId: 9,
    labs: [
      {
        id: 17,
        title: "systemctl Practice",
        description:
          "Practice starting, stopping, and enabling services.",
        difficulty: "Advanced",
        estimatedTime: "35 min",
        xp: 100,
      },
      {
        id: 18,
        title: "journalctl Practice",
        description:
          "Practice reading and filtering system logs.",
        difficulty: "Advanced",
        estimatedTime: "35 min",
        xp: 100,
      },
    ],
  },
  {
    moduleId: 10,
    labs: [
      {
        id: 19,
        title: "Partition Inspection",
        description:
          "Practice inspecting disks and partitions.",
        difficulty: "Advanced",
        estimatedTime: "40 min",
        xp: 100,
      },
      {
        id: 20,
        title: "Mounting Practice",
        description:
          "Practice mounting and unmounting filesystems.",
        difficulty: "Advanced",
        estimatedTime: "40 min",
        xp: 100,
      },
    ],
  },
  {
    moduleId: 11,
    labs: [
      {
        id: 21,
        title: "SELinux Practice",
        description:
          "Practice inspecting SELinux modes and contexts.",
        difficulty: "Advanced",
        estimatedTime: "40 min",
        xp: 100,
      },
      {
        id: 22,
        title: "SSH Hardening Drill",
        description:
          "Practice hardening SSH configuration.",
        difficulty: "Advanced",
        estimatedTime: "40 min",
        xp: 100,
      },
    ],
  },
  {
    moduleId: 12,
    labs: [
      {
        id: 23,
        title: "Alias and Function Practice",
        description:
          "Practice creating aliases and shell functions.",
        difficulty: "Advanced",
        estimatedTime: "30 min",
        xp: 100,
      },
      {
        id: 24,
        title: "Shell Customization Drill",
        description:
          "Practice customizing your shell prompt and environment.",
        difficulty: "Advanced",
        estimatedTime: "30 min",
        xp: 100,
      },
    ],
  },
];

export default labCategories;
