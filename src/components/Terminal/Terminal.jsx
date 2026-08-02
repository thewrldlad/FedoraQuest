import { useState, useRef, useEffect } from "react";
import {
  createInitialFileSystem,
  runCommand,
  getCompletions,
  formatPath,
} from "../../utils/terminalFileSystem";

export default function Terminal({ exercise, onExerciseComplete }) {
  const [fs, setFs] = useState(() => createInitialFileSystem());
  const [cwd, setCwd] = useState([]);
  const [lines, setLines] = useState([
    {
      type: "output",
      text: "FedoraQuest terminal simulator. Type 'help' to get started.",
    },
  ]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const prompt = `[user@fedora ${formatPath(cwd)}]$`;

  const handleSubmit = () => {
    const command = input;

    if (command.trim() === "") {
      setLines((current) => [
        ...current,
        { type: "input", text: `${prompt} ${command}` },
      ]);
      setInput("");
      return;
    }

    const result = runCommand(fs, cwd, command);
    const promptLine = { type: "input", text: `${prompt} ${command}` };

    if (result.clearScreen) {
      setLines([]);
    } else {
      const outputLines = result.output.map((text) => ({
        type: result.error ? "error" : "output",
        text,
      }));
      setLines((current) => [...current, promptLine, ...outputLines]);
    }

    setFs(result.fs);
    setCwd(result.cwd);

    const updatedHistory = [...commandHistory, command];
    setCommandHistory(updatedHistory);
    setHistoryIndex(null);
    setInput("");

    if (exercise && !exerciseCompleted) {
      const goalMet = exercise.checkGoal({
        fs: result.fs,
        cwd: result.cwd,
        history: updatedHistory,
      });

      if (goalMet) {
        setExerciseCompleted(true);
        onExerciseComplete?.();
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (commandHistory.length === 0) return;

      const nextIndex =
        historyIndex === null
          ? commandHistory.length - 1
          : Math.max(historyIndex - 1, 0);

      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;

      const nextIndex = historyIndex + 1;

      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();

      const matches = getCompletions(fs, cwd, input);

      if (matches.length === 1) {
        const tokens = input.split(/\s+/);
        tokens[tokens.length - 1] = matches[0];
        setInput(tokens.join(" "));
      } else if (matches.length > 1) {
        setLines((current) => [
          ...current,
          { type: "input", text: `${prompt} ${input}` },
          { type: "output", text: matches.join("  ") },
        ]);
      }
    }
  };

  return (
    <div
      className="bg-fedora-bg border border-fedora-border rounded-lg p-4 font-mono text-sm h-80 overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, index) => (
        <div
          key={index}
          className={
            line.type === "error"
              ? "text-red-400 whitespace-pre-wrap"
              : line.type === "input"
              ? "text-fedora-accent-light whitespace-pre-wrap"
              : "text-fedora-text whitespace-pre-wrap"
          }
        >
          {line.text}
        </div>
      ))}

      <div className="flex items-center gap-2">
        <span className="text-fedora-accent-light shrink-0">{prompt}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          className="bg-transparent outline-none text-fedora-text flex-1"
          aria-label="Terminal input"
        />
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
