import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import useAdmin from "../../hooks/useAdmin";
import DataTable from "../../components/Admin/DataTable";
import SearchBar from "../../components/Admin/SearchBar";
import AdminFormModal from "../../components/Admin/AdminFormModal";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import QuizQuestion from "../../components/Quiz/QuizQuestion";
import Button from "../../components/Button/Button";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const QUESTION_TYPES = ["single", "multiple", "boolean", "fill-blank", "ordering"];

const EMPTY_QUESTION = {
  id: 1,
  type: "single",
  question: "",
  options: ["", ""],
  correctAnswers: [0],
  acceptedAnswers: [""],
  items: ["", ""],
  correctOrder: [0, 1],
  explanation: "",
};

const EMPTY_FORM = {
  title: "",
  lessonId: "",
  difficulty: "beginner",
  passingScore: 70,
  timeLimitSeconds: "",
  published: false,
  questions: [],
};

// Parses a comma-separated field into an array, tolerating trailing commas.
function parseList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
}

export default function AdminQuizzes() {
  const { quizzes } = useAdmin();
  const { searchTerm: globalSearch } = useOutletContext();

  const [localSearch, setLocalSearch] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [previewQuiz, setPreviewQuiz] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  const query = (localSearch || globalSearch || "").trim().toLowerCase();

  const filtered = quizzes.items.filter(
    (quiz) => query === "" || quiz.title.toLowerCase().includes(query)
  );

  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setModalMode("create");
  };

  const openEdit = (quiz) => {
    setEditingId(quiz.id);
    setFormData({ ...quiz, timeLimitSeconds: quiz.timeLimitSeconds ?? "" });
    setModalMode("edit");
  };

  const addQuestion = () => {
    setFormData((current) => ({
      ...current,
      questions: [
        ...current.questions,
        { ...EMPTY_QUESTION, id: (current.questions.length || 0) + 1 },
      ],
    }));
  };

  const updateQuestion = (index, updates) => {
    setFormData((current) => ({
      ...current,
      questions: current.questions.map((question, i) =>
        i === index ? { ...question, ...updates } : question
      ),
    }));
  };

  const removeQuestion = (index) => {
    setFormData((current) => ({
      ...current,
      questions: current.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      lessonId: formData.lessonId ? Number(formData.lessonId) : null,
      passingScore: Number(formData.passingScore) || 70,
      timeLimitSeconds: formData.timeLimitSeconds
        ? Number(formData.timeLimitSeconds)
        : null,
    };

    if (modalMode === "create") {
      quizzes.add(payload);
    } else {
      quizzes.edit(editingId, payload);
    }

    setModalMode(null);
  };

  const openPreview = (quiz) => {
    setPreviewQuiz(quiz);
    setPreviewIndex(0);
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "lessonId", label: "Lesson ID" },
    { key: "difficulty", label: "Difficulty" },
    { key: "passingScore", label: "Passing %" },
    {
      key: "questions",
      label: "Questions",
      render: (row) => row.questions.length,
    },
    {
      key: "published",
      label: "Status",
      render: (row) => (
        <button
          onClick={() => quizzes.edit(row.id, { published: !row.published })}
          className={row.published ? "text-green-400" : "text-fedora-muted"}
        >
          {row.published ? "Published" : "Draft"}
        </button>
      ),
    },
  ];

  const actions = (row) => (
    <div className="flex justify-end gap-2">
      <Button size="sm" variant="secondary" onClick={() => openPreview(row)}>
        Preview
      </Button>
      <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>
        Edit
      </Button>
      <Button size="sm" variant="secondary" onClick={() => setDeleteTarget(row)}>
        Delete
      </Button>
    </div>
  );

  const previewQuestion = previewQuiz?.questions[previewIndex];

  // Branches explicitly on type rather than a truthy fallback chain —
  // every question object carries all of correctAnswers/correctOrder/
  // acceptedAnswers regardless of type, so a `||` chain would always
  // pick correctAnswers first even for fill-blank/ordering questions.
  const previewResponse = (() => {
    if (!previewQuestion) return null;
    if (previewQuestion.type === "fill-blank") {
      return previewQuestion.acceptedAnswers?.[0] || "";
    }
    if (previewQuestion.type === "ordering") {
      return previewQuestion.correctOrder || [];
    }
    return previewQuestion.correctAnswers || [];
  })();

  return (
    <div>
      <p className="bg-fedora-surface border border-fedora-border rounded-lg px-4 py-3 text-fedora-muted text-sm mb-6">
        Quizzes managed here are a staging area seeded from the real quiz
        engine — changes here don't yet appear to students. Preview is safe
        to use: it doesn't record any attempt, XP, or achievement progress.
      </p>

      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-display text-fedora-text">Quizzes</h1>
        <Button onClick={openCreate}>Create Quiz</Button>
      </div>
      <p className="text-fedora-muted mb-6">
        Manage quiz questions, passing scores, and XP configuration.
      </p>

      <div className="mb-4 max-w-sm">
        <SearchBar
          value={localSearch}
          onChange={setLocalSearch}
          placeholder="Search quizzes..."
        />
      </div>

      <DataTable columns={columns} rows={filtered} actions={actions} />

      {modalMode && (
        <AdminFormModal
          title={modalMode === "create" ? "Create Quiz" : "Edit Quiz"}
          onClose={() => setModalMode(null)}
          footer={
            <>
              <Button type="submit" form="quiz-form">
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setModalMode(null)}
              >
                Cancel
              </Button>
            </>
          }
        >
          <form id="quiz-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-fedora-muted mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, title: event.target.value }))
                }
                className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-fedora-muted mb-1">
                  Lesson ID
                </label>
                <input
                  type="number"
                  value={formData.lessonId}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      lessonId: event.target.value,
                    }))
                  }
                  className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-fedora-muted mb-1">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      difficulty: event.target.value,
                    }))
                  }
                  className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
                >
                  {DIFFICULTIES.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-fedora-muted mb-1">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passingScore}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      passingScore: event.target.value,
                    }))
                  }
                  className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
                />
              </div>

              <div>
                <label className="block text-sm text-fedora-muted mb-1">
                  Time Limit (seconds, blank = untimed)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.timeLimitSeconds}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      timeLimitSeconds: event.target.value,
                    }))
                  }
                  className="w-full bg-fedora-bg border border-fedora-border rounded-lg px-3 py-2 text-fedora-text focus:outline-none focus:border-fedora-accent"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-fedora-muted">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    published: event.target.checked,
                  }))
                }
                className="accent-fedora-accent"
              />
              Published
            </label>

            <div className="border-t border-fedora-border pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-fedora-muted">
                  Questions ({formData.questions.length})
                </p>
                <Button type="button" size="sm" variant="secondary" onClick={addQuestion}>
                  <span className="flex items-center gap-1">
                    <Plus size={14} /> Add Question
                  </span>
                </Button>
              </div>

              <div className="space-y-4">
                {formData.questions.map((question, index) => (
                  <div
                    key={index}
                    className="bg-fedora-bg border border-fedora-border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <select
                        value={question.type}
                        onChange={(event) =>
                          updateQuestion(index, { type: event.target.value })
                        }
                        className="bg-fedora-surface border border-fedora-border rounded-md px-2 py-1 text-fedora-text text-xs"
                      >
                        {QUESTION_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="text-fedora-muted hover:text-red-400"
                        aria-label="Remove question"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={question.question}
                      onChange={(event) =>
                        updateQuestion(index, { question: event.target.value })
                      }
                      placeholder="Question text"
                      className="w-full bg-fedora-surface border border-fedora-border rounded-md px-2 py-1.5 text-fedora-text text-sm"
                    />

                    {(question.type === "single" ||
                      question.type === "multiple" ||
                      question.type === "boolean") && (
                      <>
                        <input
                          type="text"
                          value={question.options.join(", ")}
                          onChange={(event) =>
                            updateQuestion(index, {
                              options: parseList(event.target.value),
                            })
                          }
                          placeholder="Options, comma-separated"
                          className="w-full bg-fedora-surface border border-fedora-border rounded-md px-2 py-1.5 text-fedora-text text-sm"
                        />
                        <input
                          type="text"
                          value={question.correctAnswers.join(", ")}
                          onChange={(event) =>
                            updateQuestion(index, {
                              correctAnswers: parseList(event.target.value).map(Number),
                            })
                          }
                          placeholder="Correct option index/indices, comma-separated (0-based)"
                          className="w-full bg-fedora-surface border border-fedora-border rounded-md px-2 py-1.5 text-fedora-text text-sm"
                        />
                      </>
                    )}

                    {question.type === "fill-blank" && (
                      <input
                        type="text"
                        value={question.acceptedAnswers.join(", ")}
                        onChange={(event) =>
                          updateQuestion(index, {
                            acceptedAnswers: parseList(event.target.value),
                          })
                        }
                        placeholder="Accepted answers, comma-separated"
                        className="w-full bg-fedora-surface border border-fedora-border rounded-md px-2 py-1.5 text-fedora-text text-sm"
                      />
                    )}

                    {question.type === "ordering" && (
                      <>
                        <input
                          type="text"
                          value={question.items.join(", ")}
                          onChange={(event) =>
                            updateQuestion(index, {
                              items: parseList(event.target.value),
                            })
                          }
                          placeholder="Items in shuffled/default order, comma-separated"
                          className="w-full bg-fedora-surface border border-fedora-border rounded-md px-2 py-1.5 text-fedora-text text-sm"
                        />
                        <input
                          type="text"
                          value={question.correctOrder.join(", ")}
                          onChange={(event) =>
                            updateQuestion(index, {
                              correctOrder: parseList(event.target.value).map(Number),
                            })
                          }
                          placeholder="Correct order, item indices comma-separated (0-based)"
                          className="w-full bg-fedora-surface border border-fedora-border rounded-md px-2 py-1.5 text-fedora-text text-sm"
                        />
                      </>
                    )}

                    <input
                      type="text"
                      value={question.explanation}
                      onChange={(event) =>
                        updateQuestion(index, { explanation: event.target.value })
                      }
                      placeholder="Explanation shown after answering"
                      className="w-full bg-fedora-surface border border-fedora-border rounded-md px-2 py-1.5 text-fedora-text text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </form>
        </AdminFormModal>
      )}

      {previewQuiz && (
        <AdminFormModal
          title={`Preview: ${previewQuiz.title}`}
          onClose={() => setPreviewQuiz(null)}
          footer={
            <>
              <Button
                variant="secondary"
                disabled={previewIndex === 0}
                onClick={() => setPreviewIndex((i) => i - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                disabled={previewIndex >= previewQuiz.questions.length - 1}
                onClick={() => setPreviewIndex((i) => i + 1)}
              >
                Next
              </Button>
              <Button onClick={() => setPreviewQuiz(null)}>Close Preview</Button>
            </>
          }
        >
          {previewQuiz.questions.length === 0 ? (
            <p className="text-fedora-muted text-sm">
              This quiz has no questions yet.
            </p>
          ) : (
            <>
              <p className="text-fedora-muted text-xs mb-3">
                Question {previewIndex + 1} of {previewQuiz.questions.length} —
                answer key shown, no progress is recorded
              </p>
              <QuizQuestion
                question={previewQuestion}
                response={previewResponse}
                onChange={() => {}}
                showFeedback
              />
            </>
          )}
        </AdminFormModal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Quiz"
          message={`Delete "${deleteTarget.title}"? This removes it from the staging area only.`}
          confirmLabel="Delete"
          onConfirm={() => {
            quizzes.remove(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
