import { useState } from "react";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import modules from "../data/modules";
import labCategories from "../data/labs";
import terminalExercises from "../data/terminalExercises";
import Terminal from "../components/Terminal/Terminal";
import Button from "../components/Button/Button";
import { useGame } from "../context/GameContext";
import * as achievementService from "../services/achievementService";

export default function Labs() {
  const {
    uid,
    completedLabs,
    setCompletedLabs,
    unlockedLabs,
    setUnlockedLabs,
    addXP,
  } = useGame();

  // Fire-and-forget writes to the shared progress/{uid} document —
  // GameContext's real-time listener picks up the new totals on its own
  // and checkAchievements.js (run centrally from GameContext) unlocks
  // "hundred_commands"/"terminal_expert" once the thresholds are met.
  const handleCommandExecuted = (commandName) => {
    if (!uid) return;
    achievementService.incrementCommandsExecuted(uid);
    achievementService.recordCommandUsed(uid, commandName);
  };

  const [expandedCategories, setExpandedCategories] = useState([1]);
  const [activeLabId, setActiveLabId] = useState(null);

  const allLabs = labCategories.flatMap((category) => category.labs);

  const completeLab = (lab) => {
    if (completedLabs.includes(lab.id)) return;

    addXP(lab.xp);

    setCompletedLabs((current) => {
      if (current.includes(lab.id)) return current;
      return [...current, lab.id];
    });

    setUnlockedLabs((current) => {
      const currentIndex = allLabs.findIndex((l) => l.id === lab.id);
      const nextLab = allLabs[currentIndex + 1];

      if (!nextLab || current.includes(nextLab.id)) {
        return current;
      }

      return [...current, nextLab.id];
    });

    setActiveLabId(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-display text-fedora-text mb-2">
        Labs
      </h1>

      <p className="text-fedora-muted mb-8">
        Practice real Linux skills with hands-on labs for each module.
      </p>

      <div className="space-y-8">
        {labCategories.map((category) => {
          const module = modules.find(
            (m) => m.id === category.moduleId
          );

          if (!module) return null;

          const isExpanded = expandedCategories.includes(
            category.moduleId
          );

          return (
            <div key={category.moduleId}>
              <button
                onClick={() => {
                  setExpandedCategories((current) =>
                    current.includes(category.moduleId)
                      ? current.filter(
                          (id) => id !== category.moduleId
                        )
                      : [...current, category.moduleId]
                  );
                }}
                className="flex items-center gap-2 text-2xl font-display text-fedora-text mb-2 hover:text-fedora-accent transition-colors"
              >
                <span>{isExpanded ? "▼" : "▶"}</span>
                <span>{module.title}</span>
              </button>

              <p className="text-fedora-muted mb-4">
                {module.description}
              </p>

              {isExpanded && (
                <div className="space-y-4">
                  {category.labs.map((lab) => {
                    const completed = completedLabs.includes(lab.id);
                    const unlocked = unlockedLabs.includes(lab.id);
                    const isActive = activeLabId === lab.id;

                    return (
                      <div
                        key={lab.id}
                        className="bg-fedora-surface border border-fedora-border rounded-xl p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            {completed ? (
                              <CheckCircle2
                                size={20}
                                className="text-green-400 shrink-0 mt-1"
                              />
                            ) : unlocked ? (
                              <Circle
                                size={20}
                                className="text-fedora-muted shrink-0 mt-1"
                              />
                            ) : (
                              <Lock
                                size={20}
                                className="text-fedora-muted shrink-0 mt-1"
                              />
                            )}

                            <div>
                              <h3 className="text-xl font-display text-fedora-text">
                                {lab.title}
                              </h3>

                              <p className="text-fedora-muted mt-1">
                                {lab.description}
                              </p>

                              <div className="flex items-center gap-3 mt-3 text-sm text-fedora-muted">
                                <span className="px-2 py-1 rounded-md bg-fedora-border text-fedora-accent-light">
                                  {lab.difficulty}
                                </span>
                                <span>⏱ {lab.estimatedTime}</span>
                                <span>⭐ {lab.xp} XP</span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {completed ? (
                              <span className="text-sm font-medium text-green-400">
                                ✅ Completed
                              </span>
                            ) : unlocked ? (
                              <Button
                                size="sm"
                                onClick={() =>
                                  setActiveLabId((current) =>
                                    current === lab.id ? null : lab.id
                                  )
                                }
                              >
                                {isActive ? "Close" : "Start Lab"}
                              </Button>
                            ) : (
                              <span className="text-sm text-gray-500">
                                🔒 Locked
                              </span>
                            )}
                          </div>
                        </div>

                        {isActive && unlocked && !completed && (
                          <div className="mt-4 pt-4 border-t border-fedora-border">
                            {terminalExercises[lab.id] ? (
                              <>
                                <p className="text-fedora-text leading-7 mb-4">
                                  {terminalExercises[lab.id].prompt}
                                </p>

                                <Terminal
                                  exercise={terminalExercises[lab.id]}
                                  onExerciseComplete={() => completeLab(lab)}
                                  onCommandExecuted={handleCommandExecuted}
                                />
                              </>
                            ) : (
                              <>
                                <p className="text-fedora-text leading-7">
                                  🚧 This lab doesn't have an interactive
                                  terminal exercise yet. Check back soon.
                                </p>

                                <Button
                                  className="mt-4"
                                  onClick={() => completeLab(lab)}
                                >
                                  Mark Lab Complete
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
