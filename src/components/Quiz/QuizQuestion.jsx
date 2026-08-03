import MultipleChoice from "./MultipleChoice";
import MultipleSelect from "./MultipleSelect";
import TrueFalse from "./TrueFalse";
import FillBlank from "./FillBlank";
import CommandOrdering from "./CommandOrdering";

// Dispatches to the right answer-mechanism renderer by question.type.
// "matching" (and any future type) falls through to the honest notice
// below instead of crashing — this is the "prepare architecture even if
// implemented later" seam.
const RENDERERS = {
  single: MultipleChoice,
  multiple: MultipleSelect,
  boolean: TrueFalse,
  "fill-blank": FillBlank,
  ordering: CommandOrdering,
};

export default function QuizQuestion({ question, response, onChange, showFeedback }) {
  const Renderer = RENDERERS[question.type];

  return (
    <div>
      {question.scenario && (
        <p className="text-fedora-text leading-7 mb-4 italic">
          {question.scenario}
        </p>
      )}

      <h3 className="text-xl font-display text-fedora-text mb-4">
        {question.question}
      </h3>

      {question.codeBlock && (
        <pre className="bg-fedora-bg border border-fedora-border rounded-lg px-4 py-3 text-fedora-accent-light text-sm mb-4 overflow-x-auto whitespace-pre-wrap font-mono">
          {question.codeBlock}
        </pre>
      )}

      {Renderer ? (
        <Renderer
          question={question}
          response={response}
          onChange={onChange}
          showFeedback={showFeedback}
        />
      ) : (
        <p className="text-fedora-muted text-sm italic">
          This question type ("{question.type}") isn't supported by the
          player yet — the architecture is ready, the renderer is coming
          later.
        </p>
      )}

      {showFeedback && question.explanation && (
        <p className="text-fedora-muted text-sm mt-4 border-t border-fedora-border pt-4">
          {question.explanation}
        </p>
      )}
    </div>
  );
}
