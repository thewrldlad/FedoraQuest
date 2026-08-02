const modules = [
  {
    id: 1,
    title: "Linux Basics",
    description: "Learn the Linux basics and get comfortable navigating the terminal.",
    lessons: [
      {
        id: 1,
        day: "Day 1",
        title: "Terminal Navigation",
        description:
          "Learn the Linux terminal by mastering navigation commands.",
        xp: 100,
      },
      {
        id: 2,
        day: "Day 2",
        title: "File & Directory Management",
        description:
          "Create, organize, copy, move, and remove files and directories using core Linux commands.",
        xp: 100,
      },
      {
        id: 3,
        day: "Day 3",
        title: "Getting Help in Linux",
        description:
          "Learn to use man pages, --help, and info to find documentation.",
        xp: 100,
      },
    ],
  },
  {
    id: 2,
    title: "File System",
    description: "Understand how Linux organizes files, directories, and paths.",
    lessons: [
      {
        id: 4,
        day: "Day 4",
        title: "Linux File System",
        description:
          "Understand directories, files, and Linux paths.",
        xp: 150,
      },
      {
        id: 5,
        day: "Day 5",
        title: "Working with Files and Directories",
        description:
          "Create, copy, move, and remove files and directories.",
        xp: 150,
      },
      {
        id: 6,
        day: "Day 6",
        title: "File System Hierarchy Standard",
        description:
          "Explore the standard Linux directory layout (/etc, /var, /home, and more).",
        xp: 150,
      },
    ],
  },
  {
    id: 3,
    title: "File Permissions",
    description: "Learn how Linux permissions and ownership control access.",
    lessons: [
      {
        id: 7,
        day: "Day 7",
        title: "Understanding Permissions",
        description:
          "Learn the read, write, and execute permission model.",
        xp: 150,
      },
      {
        id: 8,
        day: "Day 8",
        title: "Changing Permissions with chmod",
        description:
          "Modify file and directory permissions using chmod.",
        xp: 150,
      },
      {
        id: 9,
        day: "Day 9",
        title: "Ownership with chown and chgrp",
        description:
          "Change file ownership and group associations.",
        xp: 150,
      },
    ],
  },
  {
    id: 4,
    title: "Users and Groups",
    description: "Manage user accounts, groups, and administrative privileges.",
    lessons: [
      {
        id: 10,
        day: "Day 10",
        title: "Managing Users",
        description:
          "Create, modify, and delete user accounts.",
        xp: 150,
      },
      {
        id: 11,
        day: "Day 11",
        title: "Managing Groups",
        description:
          "Organize users into groups and manage group membership.",
        xp: 150,
      },
      {
        id: 12,
        day: "Day 12",
        title: "sudo and Privilege Escalation",
        description:
          "Understand sudo and the principle of least privilege.",
        xp: 150,
      },
    ],
  },
  {
    id: 5,
    title: "Processes",
    description: "Learn how to view and control running processes.",
    lessons: [
      {
        id: 13,
        day: "Day 13",
        title: "Viewing Processes",
        description:
          "Use ps, top, and htop to inspect running processes.",
        xp: 200,
      },
      {
        id: 14,
        day: "Day 14",
        title: "Managing Processes",
        description:
          "Start, stop, and control processes with signals.",
        xp: 200,
      },
      {
        id: 15,
        day: "Day 15",
        title: "Background and Foreground Jobs",
        description:
          "Manage jobs with &, jobs, fg, and bg.",
        xp: 200,
      },
    ],
  },
  {
    id: 6,
    title: "Networking",
    description: "Understand Linux networking fundamentals and troubleshooting.",
    lessons: [
      {
        id: 16,
        day: "Day 16",
        title: "Networking Basics",
        description:
          "Understand IP addresses, interfaces, and connectivity.",
        xp: 200,
      },
      {
        id: 17,
        day: "Day 17",
        title: "Network Troubleshooting Tools",
        description:
          "Use ping, curl, and ss to diagnose network issues.",
        xp: 200,
      },
      {
        id: 18,
        day: "Day 18",
        title: "Firewalls with firewalld",
        description:
          "Manage Fedora's firewall zones and rules.",
        xp: 200,
      },
    ],
  },
  {
    id: 7,
    title: "Bash Scripting",
    description: "Automate tasks by writing your own Bash scripts.",
    lessons: [
      {
        id: 19,
        day: "Day 19",
        title: "Writing Your First Script",
        description:
          "Create and run a basic Bash script.",
        xp: 200,
      },
      {
        id: 20,
        day: "Day 20",
        title: "Variables and Input",
        description:
          "Use variables and read user input in scripts.",
        xp: 200,
      },
      {
        id: 21,
        day: "Day 21",
        title: "Conditionals and Loops",
        description:
          "Control script flow with if statements and loops.",
        xp: 200,
      },
    ],
  },
  {
    id: 8,
    title: "Package Management (DNF & Flatpak)",
    description: "Install and manage software using DNF and Flatpak.",
    lessons: [
      {
        id: 22,
        day: "Day 22",
        title: "Installing Software with DNF",
        description:
          "Install, update, and remove packages using DNF.",
        xp: 200,
      },
      {
        id: 23,
        day: "Day 23",
        title: "Managing Repositories",
        description:
          "Add and manage DNF repositories.",
        xp: 200,
      },
      {
        id: 24,
        day: "Day 24",
        title: "Using Flatpak",
        description:
          "Install and manage sandboxed apps with Flatpak.",
        xp: 200,
      },
    ],
  },
  {
    id: 9,
    title: "System Services (systemd)",
    description: "Manage services and inspect logs using systemd.",
    lessons: [
      {
        id: 25,
        day: "Day 25",
        title: "Introduction to systemd",
        description:
          "Understand units, services, and targets.",
        xp: 250,
      },
      {
        id: 26,
        day: "Day 26",
        title: "Managing Services",
        description:
          "Start, stop, enable, and disable services with systemctl.",
        xp: 250,
      },
      {
        id: 27,
        day: "Day 27",
        title: "Reading Logs with journalctl",
        description:
          "Inspect system logs using journalctl.",
        xp: 250,
      },
    ],
  },
  {
    id: 10,
    title: "Storage and Disks",
    description: "Understand disks, partitions, and filesystems on Linux.",
    lessons: [
      {
        id: 28,
        day: "Day 28",
        title: "Disk Basics",
        description:
          "Understand disks, partitions, and mount points.",
        xp: 250,
      },
      {
        id: 29,
        day: "Day 29",
        title: "Managing Partitions",
        description:
          "Use tools like fdisk and lsblk to manage partitions.",
        xp: 250,
      },
      {
        id: 30,
        day: "Day 30",
        title: "Filesystems and Mounting",
        description:
          "Format, mount, and unmount filesystems.",
        xp: 250,
      },
    ],
  },
  {
    id: 11,
    title: "Security Basics",
    description: "Learn foundational Linux security concepts and hardening.",
    lessons: [
      {
        id: 31,
        day: "Day 31",
        title: "Linux Security Fundamentals",
        description:
          "Understand the Linux security model and attack surface.",
        xp: 250,
      },
      {
        id: 32,
        day: "Day 32",
        title: "SELinux Basics",
        description:
          "Understand SELinux modes and contexts on Fedora.",
        xp: 250,
      },
      {
        id: 33,
        day: "Day 33",
        title: "Securing SSH Access",
        description:
          "Harden SSH configuration for remote access.",
        xp: 250,
      },
    ],
  },
  {
    id: 12,
    title: "Shell Productivity",
    description: "Boost your efficiency with shell customization and shortcuts.",
    lessons: [
      {
        id: 34,
        day: "Day 34",
        title: "Shell Aliases and Functions",
        description:
          "Speed up your workflow with aliases and functions.",
        xp: 250,
      },
      {
        id: 35,
        day: "Day 35",
        title: "Customizing Your Shell",
        description:
          "Configure your prompt and environment with dotfiles.",
        xp: 250,
      },
      {
        id: 36,
        day: "Day 36",
        title: "Keyboard Shortcuts and History",
        description:
          "Master Bash history and terminal shortcuts.",
        xp: 250,
      },
    ],
  },
];

export default modules;
