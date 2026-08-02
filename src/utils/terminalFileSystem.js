// Simulated Linux filesystem + command engine.
// Pure data/logic only — no React, no real shell access.
//
// A directory node: { type: "dir", children: { name: node, ... } }
// A file node:      { type: "file", content: string }
//
// The tree root IS the home directory ("~"). `cwd` is an array of path
// segments relative to home, e.g. [] = "~", ["Documents"] = "~/Documents".

export function createInitialFileSystem() {
  return {
    type: "dir",
    children: {
      Documents: { type: "dir", children: {} },
      Downloads: { type: "dir", children: {} },
      Projects: { type: "dir", children: {} },
      Pictures: { type: "dir", children: {} },
    },
  };
}

export function formatPath(cwd) {
  return cwd.length === 0 ? "~" : `~/${cwd.join("/")}`;
}

function cloneFs(fs) {
  return JSON.parse(JSON.stringify(fs));
}

function getNode(fs, segments) {
  let node = fs;
  for (const segment of segments) {
    if (!node || node.type !== "dir" || !node.children[segment]) {
      return null;
    }
    node = node.children[segment];
  }
  return node;
}

function splitPath(segments) {
  return {
    parentSegments: segments.slice(0, -1),
    name: segments[segments.length - 1],
  };
}

function resolvePath(cwd, target) {
  if (!target) return [...cwd];

  const isAbsolute = target.startsWith("~") || target.startsWith("/");
  const rawSegments = isAbsolute
    ? target.replace(/^~/, "").split("/").filter(Boolean)
    : target.split("/").filter(Boolean);

  const base = isAbsolute ? [] : [...cwd];

  for (const part of rawSegments) {
    if (part === ".") continue;
    if (part === "..") {
      base.pop();
    } else {
      base.push(part);
    }
  }

  return base;
}

function tokenize(input) {
  const matches = input.match(/(?:[^\s"']+|"[^"]*"|'[^']*')/g);
  if (!matches) return [];
  return matches.map((token) =>
    token.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1")
  );
}

const commandHandlers = {
  pwd: (args, { cwd }) => ({ output: [formatPath(cwd)] }),

  ls: (args, { fs, cwd }) => {
    const targetPath = args[0];
    const segments = targetPath ? resolvePath(cwd, targetPath) : cwd;
    const node = getNode(fs, segments);

    if (!node) {
      return {
        output: [`ls: cannot access '${targetPath}': No such file or directory`],
        error: true,
      };
    }

    if (node.type === "file") {
      return { output: [targetPath] };
    }

    const names = Object.keys(node.children).sort();
    if (names.length === 0) return { output: [] };

    const formatted = names.map((name) =>
      node.children[name].type === "dir" ? `${name}/` : name
    );
    return { output: [formatted.join("  ")] };
  },

  cd: (args, { fs, cwd }) => {
    const targetPath = args[0] || "~";
    const segments = resolvePath(cwd, targetPath);
    const node = getNode(fs, segments);

    if (!node) {
      return {
        output: [`bash: cd: ${targetPath}: No such file or directory`],
        error: true,
      };
    }
    if (node.type !== "dir") {
      return {
        output: [`bash: cd: ${targetPath}: Not a directory`],
        error: true,
      };
    }

    return { cwd: segments };
  },

  mkdir: (args, { fs, cwd }) => {
    if (args.length === 0) {
      return { output: ["mkdir: missing operand"], error: true };
    }

    const newFs = cloneFs(fs);
    const output = [];
    let hasError = false;

    for (const targetPath of args) {
      const segments = resolvePath(cwd, targetPath);
      const { parentSegments, name } = splitPath(segments);
      const parent = getNode(newFs, parentSegments);

      if (!name || !parent || parent.type !== "dir") {
        output.push(
          `mkdir: cannot create directory '${targetPath}': No such file or directory`
        );
        hasError = true;
        continue;
      }
      if (parent.children[name]) {
        output.push(
          `mkdir: cannot create directory '${targetPath}': File exists`
        );
        hasError = true;
        continue;
      }

      parent.children[name] = { type: "dir", children: {} };
    }

    return { fs: newFs, output, error: hasError };
  },

  touch: (args, { fs, cwd }) => {
    if (args.length === 0) {
      return { output: ["touch: missing file operand"], error: true };
    }

    const newFs = cloneFs(fs);
    const output = [];
    let hasError = false;

    for (const targetPath of args) {
      const segments = resolvePath(cwd, targetPath);
      const { parentSegments, name } = splitPath(segments);
      const parent = getNode(newFs, parentSegments);

      if (!name || !parent || parent.type !== "dir") {
        output.push(`touch: cannot touch '${targetPath}': No such file or directory`);
        hasError = true;
        continue;
      }

      if (!parent.children[name]) {
        parent.children[name] = { type: "file", content: "" };
      }
    }

    return { fs: newFs, output, error: hasError };
  },

  rm: (args, { fs, cwd }) => {
    const recursive = args.some((arg) => /^-\w*r\w*$/i.test(arg));
    const targets = args.filter((arg) => !arg.startsWith("-"));

    if (targets.length === 0) {
      return { output: ["rm: missing operand"], error: true };
    }

    const newFs = cloneFs(fs);
    const output = [];
    let hasError = false;

    for (const targetPath of targets) {
      const segments = resolvePath(cwd, targetPath);
      const { parentSegments, name } = splitPath(segments);
      const parent = getNode(newFs, parentSegments);
      const node = parent && parent.type === "dir" ? parent.children[name] : null;

      if (!node) {
        output.push(`rm: cannot remove '${targetPath}': No such file or directory`);
        hasError = true;
        continue;
      }
      if (node.type === "dir" && !recursive) {
        output.push(`rm: cannot remove '${targetPath}': Is a directory`);
        hasError = true;
        continue;
      }

      delete parent.children[name];
    }

    return { fs: newFs, output, error: hasError };
  },

  cp: (args, { fs, cwd }) => {
    const recursive = args.includes("-r");
    const targets = args.filter((arg) => !arg.startsWith("-"));

    if (targets.length < 2) {
      return { output: ["cp: missing file operand"], error: true };
    }

    const [sourcePath, destPath] = targets;
    const sourceSegments = resolvePath(cwd, sourcePath);
    const sourceNode = getNode(fs, sourceSegments);

    if (!sourceNode) {
      return {
        output: [`cp: cannot stat '${sourcePath}': No such file or directory`],
        error: true,
      };
    }
    if (sourceNode.type === "dir" && !recursive) {
      return {
        output: [`cp: -r not specified; omitting directory '${sourcePath}'`],
        error: true,
      };
    }

    const newFs = cloneFs(fs);
    const freshSourceNode = getNode(newFs, sourceSegments);
    const destSegments = resolvePath(cwd, destPath);
    const destNode = getNode(newFs, destSegments);

    const finalSegments =
      destNode && destNode.type === "dir"
        ? [...destSegments, sourceSegments[sourceSegments.length - 1]]
        : destSegments;

    const { parentSegments, name } = splitPath(finalSegments);
    const parent = getNode(newFs, parentSegments);

    if (!name || !parent || parent.type !== "dir") {
      return {
        output: [`cp: cannot create '${destPath}': No such file or directory`],
        error: true,
      };
    }

    parent.children[name] = JSON.parse(JSON.stringify(freshSourceNode));

    return { fs: newFs, output: [] };
  },

  mv: (args, { fs, cwd }) => {
    const targets = args.filter((arg) => !arg.startsWith("-"));

    if (targets.length < 2) {
      return { output: ["mv: missing file operand"], error: true };
    }

    const [sourcePath, destPath] = targets;
    const sourceSegments = resolvePath(cwd, sourcePath);
    const sourceNode = getNode(fs, sourceSegments);

    if (!sourceNode) {
      return {
        output: [`mv: cannot stat '${sourcePath}': No such file or directory`],
        error: true,
      };
    }

    const newFs = cloneFs(fs);
    const freshSourceNode = getNode(newFs, sourceSegments);
    const destSegments = resolvePath(cwd, destPath);
    const destNode = getNode(newFs, destSegments);

    const finalSegments =
      destNode && destNode.type === "dir"
        ? [...destSegments, sourceSegments[sourceSegments.length - 1]]
        : destSegments;

    const { parentSegments: destParentSegments, name: destName } =
      splitPath(finalSegments);
    const destParent = getNode(newFs, destParentSegments);

    if (!destName || !destParent || destParent.type !== "dir") {
      return {
        output: [
          `mv: cannot move '${sourcePath}' to '${destPath}': No such file or directory`,
        ],
        error: true,
      };
    }

    const { parentSegments: sourceParentSegments, name: sourceName } =
      splitPath(sourceSegments);
    const sourceParent = getNode(newFs, sourceParentSegments);

    destParent.children[destName] = freshSourceNode;
    if (sourceParent) delete sourceParent.children[sourceName];

    return { fs: newFs, output: [] };
  },

  cat: (args, { fs, cwd }) => {
    if (args.length === 0) {
      return { output: ["cat: missing file operand"], error: true };
    }

    const output = [];
    let hasError = false;

    for (const targetPath of args) {
      const segments = resolvePath(cwd, targetPath);
      const node = getNode(fs, segments);

      if (!node) {
        output.push(`cat: ${targetPath}: No such file or directory`);
        hasError = true;
      } else if (node.type === "dir") {
        output.push(`cat: ${targetPath}: Is a directory`);
        hasError = true;
      } else {
        output.push(node.content || "");
      }
    }

    return { output, error: hasError };
  },

  echo: (args, { fs, cwd }) => {
    const redirectIndex = args.indexOf(">");

    if (redirectIndex === -1) {
      return { output: [args.join(" ")] };
    }

    const text = args.slice(0, redirectIndex).join(" ");
    const targetPath = args[redirectIndex + 1];

    if (!targetPath) {
      return {
        output: ["bash: syntax error near unexpected token `newline'"],
        error: true,
      };
    }

    const newFs = cloneFs(fs);
    const segments = resolvePath(cwd, targetPath);
    const { parentSegments, name } = splitPath(segments);
    const parent = getNode(newFs, parentSegments);

    if (!name || !parent || parent.type !== "dir") {
      return {
        output: [`bash: ${targetPath}: No such file or directory`],
        error: true,
      };
    }

    parent.children[name] = { type: "file", content: text };

    return { fs: newFs, output: [] };
  },

  clear: () => ({ output: [], clearScreen: true }),

  help: () => ({
    output: [
      "Available commands:",
      "pwd, ls, cd, mkdir, touch, rm, cp, mv, cat, echo, clear, help",
    ],
  }),
};

export function runCommand(fs, cwd, rawInput) {
  const tokens = tokenize(rawInput);

  if (tokens.length === 0) {
    return { output: [], fs, cwd, error: false, clearScreen: false };
  }

  const [name, ...args] = tokens;
  const handler = commandHandlers[name];

  if (!handler) {
    return {
      output: [`bash: ${name}: command not found`],
      fs,
      cwd,
      error: true,
      clearScreen: false,
    };
  }

  const result = handler(args, { fs, cwd });

  return {
    output: result.output || [],
    fs: result.fs || fs,
    cwd: result.cwd || cwd,
    error: !!result.error,
    clearScreen: !!result.clearScreen,
  };
}

export function getCompletions(fs, cwd, partialInput) {
  const tokens = partialInput.split(/\s+/);
  const isFirstToken = tokens.length <= 1;
  const partial = tokens[tokens.length - 1] || "";

  const pool = isFirstToken
    ? Object.keys(commandHandlers)
    : Object.keys(getNode(fs, cwd)?.children || {});

  return pool.filter((candidate) => candidate.startsWith(partial));
}
