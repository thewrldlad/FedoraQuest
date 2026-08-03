import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { getProfileCompletion } from "../../utils/profileCompletion";

// A modern completion meter with an optional expandable list of what's
// still missing — the calculation itself lives in
// utils/profileCompletion.js so this component stays purely
// presentational.
export default function ProfileCompletion({ profile }) {
  const { percent, missingFields } = getProfileCompletion(profile);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isComplete = percent === 100;

  return (
    <div className="bg-fedora-bg/60 border border-fedora-border rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-fedora-text">
          Profile Completion
        </span>
        <span className="text-sm font-display text-fedora-accent-light">
          {percent}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Profile completion"
        className="w-full h-2 bg-fedora-border rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-gradient-to-r from-fedora-accent to-fedora-accent-light rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      {!isComplete && (
        <button
          type="button"
          onClick={() => setShowSuggestions((current) => !current)}
          aria-expanded={showSuggestions}
          className="flex items-center gap-1 mt-2 text-xs text-fedora-muted hover:text-fedora-text transition-colors"
        >
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${showSuggestions ? "rotate-180" : ""}`}
          />
          {missingFields.length} thing{missingFields.length === 1 ? "" : "s"} left to complete
        </button>
      )}

      {showSuggestions && !isComplete && (
        <ul className="mt-2 space-y-1">
          {missingFields.map((label) => (
            <li key={label} className="text-xs text-fedora-muted flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-fedora-accent-light shrink-0" />
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
