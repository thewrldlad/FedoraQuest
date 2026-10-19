import modules from "./modules";
import labs from "./labs";
import commands from "./commands";

const lessonItems = modules.flatMap((module) =>
  module.lessons.map((lesson) => ({
    id: `lesson-${lesson.id}`,
    type: "lesson",
    title: lesson.title,
    description: lesson.description,
    module: module.title,
    route: `/lesson/${lesson.id}`,
    keywords: [
      lesson.title,
      lesson.description,
      module.title,
      lesson.day,
    ]
      .join(" ")
      .toLowerCase(),
  }))
);

const moduleItems = modules.map((module) => ({
  id: `module-${module.id}`,
  type: "module",
  title: module.title,
  description: module.description,
  route: "/course",
  keywords: [
    module.title,
    module.description,
  ]
    .join(" ")
    .toLowerCase(),
}));

const labItems = labs.map((lab) => ({
  id: `lab-${lab.id}`,
  type: "lab",
  title: lab.title,
  description: lab.description,
  route: `/labs/${lab.id}`,
  keywords: [
    lab.title,
    lab.description,
  ]
    .join(" ")
    .toLowerCase(),
}));

const commandItems = commands.map((command) => ({
  id: `command-${command.id}`,
  type: "command",
  title: command.command,
  description: command.description,
  route: "/commands",
  keywords: [
    command.command,
    command.description,
  ]
    .join(" ")
    .toLowerCase(),
}));

const searchIndex = [
  ...lessonItems,
  ...moduleItems,
  ...labItems,
  ...commandItems,
];

export default searchIndex;
