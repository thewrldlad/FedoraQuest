import { useState } from "react";
import { Search, Copy, Check } from "lucide-react";
import commands from "../data/commands";
import modules from "../data/modules";

const categories = [
  "All",
  "Navigation",
  "Files",
  "Permissions",
  "Users & Groups",
  "Processes",
  "Networking",
  "Package Management",
  "Services",
  "Storage",
  "System Information",
  "Shell Utilities",
];

export default function Commands() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedId, setCopiedId] = useState(null);

  const filteredCommands = commands.filter((command) => {
    const matchesCategory =
      selectedCategory === "All" || command.category === selectedCategory;

    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      command.name.toLowerCase().includes(query) ||
      command.description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const handleCopy = (command) => {
    navigator.clipboard.writeText(command.syntax);
    setCopiedId(command.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div>
      <h1 className="text-3xl font-display text-fedora-text mb-2">
        Command Center
      </h1>

      <p className="text-fedora-muted mb-8">
        Search and browse commonly used Fedora and Linux commands.
      </p>

      <div className="flex items-center gap-2 bg-fedora-surface border border-fedora-border rounded-lg px-4 py-3 mb-6">
        <Search size={18} className="text-fedora-muted shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search commands..."
          className="bg-transparent outline-none text-fedora-text placeholder:text-fedora-muted w-full"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              selectedCategory === category
                ? "bg-fedora-accent text-white"
                : "bg-fedora-surface border border-fedora-border text-fedora-text hover:bg-fedora-border"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredCommands.length === 0 ? (
        <p className="text-fedora-muted">No commands match your search.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {filteredCommands.map((command) => {
            const module = modules.find((m) => m.id === command.moduleId);
            const copied = copiedId === command.id;

            return (
              <div
                key={command.id}
                className="bg-fedora-surface border border-fedora-border rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-display text-fedora-text">
                      {command.name}
                    </h2>

                    <p className="text-fedora-muted mt-1">
                      {command.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(command)}
                    className="shrink-0 p-2 rounded-lg bg-fedora-bg border border-fedora-border text-fedora-accent-light hover:bg-fedora-border transition-colors"
                    aria-label="Copy syntax"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-3 text-sm text-fedora-muted">
                  <span className="px-2 py-1 rounded-md bg-fedora-border text-fedora-accent-light">
                    {command.category}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-fedora-border text-fedora-text">
                    {command.difficulty}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-fedora-muted mb-1">
                    Syntax
                  </p>
                  <code className="block bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-accent-light text-sm">
                    {command.syntax}
                  </code>
                </div>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-fedora-muted mb-1">
                    Examples
                  </p>
                  <div className="space-y-1">
                    {command.examples.map((example) => (
                      <code
                        key={example}
                        className="block bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text text-sm"
                      >
                        {example}
                      </code>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-fedora-muted mb-1">
                    Common Mistakes
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-fedora-muted">
                    {command.commonMistakes.map((mistake) => (
                      <li key={mistake}>{mistake}</li>
                    ))}
                  </ul>
                </div>

                {module && (
                  <p className="mt-4 text-sm text-fedora-muted">
                    Related module:{" "}
                    <span className="text-fedora-accent-light">
                      {module.title}
                    </span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
