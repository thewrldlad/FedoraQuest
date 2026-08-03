import { useGame } from "../../context/GameContext";
import useCourseProgress from "../../hooks/useCourseProgress";
import ProgressBar from "../../components/Progress/ProgressBar";

// Simple ranked-bar widget shared by the sample-data sections below —
// no charting library, consistent with the rest of the app's ProgressBar
// styling, and easy to swap for a real chart component later.
function RankedBars({ items }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-xs text-fedora-muted mb-1">
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
          <div className="w-full h-2 bg-fedora-border rounded-full overflow-hidden">
            <div
              className="h-full bg-fedora-accent rounded-full"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Widget({ title, note, children }) {
  return (
    <section className="bg-fedora-surface border border-fedora-border rounded-xl p-6">
      <h2 className="text-lg font-display text-fedora-text mb-1">{title}</h2>
      {note && <p className="text-fedora-muted text-xs mb-4">{note}</p>}
      {children}
    </section>
  );
}

// Clearly-labeled sample data — the task explicitly asks for placeholder
// analytics widgets here; wiring in a real charting library and backend
// aggregation is future work, not something to fake with a dependency
// this sandbox can't test.
const SAMPLE_DAU = [40, 55, 48, 62, 70, 58, 65];
const SAMPLE_POPULAR_COURSES = [{ label: "Master Fedora Linux", value: 1 }];
const SAMPLE_DIFFICULT_LESSONS = [
  { label: "Day 4 — Linux File System", value: 3 },
  { label: "Day 2 — File & Directory Management", value: 2 },
  { label: "Day 1 — Terminal Navigation", value: 1 },
];
const SAMPLE_XP_DISTRIBUTION = [
  { label: "0–500 XP", value: 30 },
  { label: "500–1000 XP", value: 22 },
  { label: "1000–2500 XP", value: 14 },
  { label: "2500–5000 XP", value: 6 },
];

export default function AdminAnalytics() {
  const { quizResults } = useGame();
  const progress = useCourseProgress();

  const quizAttempts = Object.values(quizResults);
  const quizPassRate =
    quizAttempts.length > 0
      ? Math.round(
          (quizAttempts.filter((result) => result.passed).length /
            quizAttempts.length) *
            100
        )
      : 0;

  return (
    <div>
      <h1 className="text-2xl font-display text-fedora-text mb-1">
        Analytics
      </h1>
      <p className="text-fedora-muted mb-6">
        Platform-wide analytics. Widgets marked "sample data" need a real
        backend to aggregate across users — the architecture (one Widget
        per metric) is ready to swap in a real chart library later.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Widget
          title="Course Completion Rate"
          note="This browser's session only"
        >
          <p className="text-3xl font-display text-fedora-text mb-2">
            {progress.courseCompletionPercent}%
          </p>
          <ProgressBar percent={progress.courseCompletionPercent} />
        </Widget>

        <Widget title="Quiz Pass Rate" note="This browser's session only">
          <p className="text-3xl font-display text-fedora-text mb-2">
            {quizPassRate}%
          </p>
          <ProgressBar percent={quizPassRate} />
        </Widget>

        <Widget title="Daily Active Users" note="Sample data">
          <div className="flex items-end gap-2 h-24">
            {SAMPLE_DAU.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-fedora-accent rounded-t"
                style={{ height: `${(value / 70) * 100}%` }}
              />
            ))}
          </div>
        </Widget>

        <Widget title="XP Distribution" note="Sample data">
          <RankedBars items={SAMPLE_XP_DISTRIBUTION} />
        </Widget>

        <Widget title="Popular Courses" note="Sample data — one course exists today">
          <RankedBars items={SAMPLE_POPULAR_COURSES} />
        </Widget>

        <Widget
          title="Most Difficult Lessons"
          note="Sample data — a real version would rank by quiz failure rate"
        >
          <RankedBars items={SAMPLE_DIFFICULT_LESSONS} />
        </Widget>
      </div>
    </div>
  );
}
