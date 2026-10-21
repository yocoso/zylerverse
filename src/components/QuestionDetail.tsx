import type { Question } from "../types/question";
import { getCollection } from "../data/collections";
import { useProgress } from "../hooks/ProgressContext";
import { useCollectionNav } from "../hooks/useCollectionNav";
import GuideReveal from "./GuideReveal";
import { Check, Heart, Shuffle } from "./icons";

const ACCENT: Record<string, { text: string; bg: string; border: string; soft: string }> = {
  social: { text: "text-social", bg: "bg-social", border: "border-social", soft: "bg-social/10" },
  family: { text: "text-family", bg: "bg-family", border: "border-family", soft: "bg-family/10" },
  brand: { text: "text-brand-600", bg: "bg-brand-500", border: "border-brand-500", soft: "bg-brand-50" }
};

interface QuestionDetailProps {
  question: Question;
}

/**
 * Shared reading experience used identically by the random flow and the
 * browser, for every collection. Handles guide reveal, discussed status, and
 * favorites. Opening or revealing the guide never changes discussed status.
 *
 * Parent screens pass a React `key={question.id}` so this remounts per
 * question — which resets the guide to hidden automatically.
 */
export default function QuestionDetail({ question }: QuestionDetailProps) {
  const collection = getCollection(question.collectionId);
  const accent = ACCENT[collection?.accent ?? "brand"];
  const { isDiscussed, toggleDiscussed, isFavorite, toggleFavorite } = useProgress();
  const { goToRandom } = useCollectionNav(question.collectionId);

  const discussed = isDiscussed(question.id);
  const favorite = isFavorite(question.id);

  return (
    <div className="space-y-5 px-4 py-5">
      {/* Category + favorite */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`chip ${accent.text} ${accent.soft} border-transparent`}>
            {collection?.icon} {collection?.name}
          </span>
          <span className="chip">{question.category}</span>
        </div>
        <button
          type="button"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorite}
          onClick={() => toggleFavorite(question.id)}
          className={`rounded-full p-2 transition ${favorite ? "text-rose-500" : "text-muted hover:text-rose-400"}`}
        >
          <Heart filled={favorite} width={24} height={24} />
        </button>
      </div>

      {/* Title + scenario + question */}
      <div className="card p-5">
        <h2 className="text-xl font-bold leading-snug">{question.title}</h2>

        {question.scenario && (
          <p className="mt-3 rounded-xl border border-line bg-paper/70 p-3 text-[15px] leading-relaxed text-ink">
            {question.scenario}
          </p>
        )}

        <p className="mt-4 text-lg font-semibold leading-relaxed text-ink">{question.question}</p>

        {question.followUpQuestions && question.followUpQuestions.length > 0 && (
          <div className="mt-4 border-t border-line pt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Follow-up questions</p>
            <ul className="space-y-1.5">
              {question.followUpQuestions.map((f, i) => (
                <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-ink">
                  <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accent.bg}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Guide */}
      <GuideReveal guide={question.guide} accentClass={accent.text} />

      {/* Status + navigation */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toggleDiscussed(question.id)}
          aria-pressed={discussed}
          className={
            discussed
              ? `btn w-full ${accent.soft} ${accent.text} border ${accent.border}`
              : "btn-secondary w-full"
          }
        >
          <Check width={20} height={20} />
          {discussed ? "Discussed — tap to undo" : "Mark as Discussed"}
        </button>

        <button type="button" onClick={() => goToRandom(question.id)} className="btn-primary w-full">
          <Shuffle width={20} height={20} />
          Next Random Question
        </button>
      </div>
    </div>
  );
}
