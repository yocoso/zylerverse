import { useState } from "react";
import type { ReactNode } from "react";
import type { Question } from "../types/question";
import { getCollection } from "../data/collections";
import { useProgress } from "../hooks/ProgressContext";
import { useCollectionNav } from "../hooks/useCollectionNav";
import GuidePanel from "./GuideReveal";
import { Bulb, Check, Heart, Shuffle } from "./icons";

const ACCENT: Record<string, { text: string; bg: string; border: string; soft: string }> = {
  social: { text: "text-social", bg: "bg-social", border: "border-social", soft: "bg-social/10" },
  family: { text: "text-family", bg: "bg-family", border: "border-family", soft: "bg-family/10" },
  brand: { text: "text-brand-600", bg: "bg-brand-500", border: "border-brand-500", soft: "bg-brand-50" }
};

/** Small, optional icon-only toggle (show ideas, mark as talked about). */
function IconToggle({
  active,
  activeClass,
  label,
  onClick,
  children
}: {
  active: boolean;
  activeClass: string;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`flex h-11 w-11 items-center justify-center rounded-xl2 border transition active:scale-95 ${
        active ? activeClass : "border-line bg-card text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

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
  const [showGuide, setShowGuide] = useState(false);

  const discussed = isDiscussed(question.id);
  const favorite = isFavorite(question.id);
  const activeAccent = `${accent.border} ${accent.soft} ${accent.text}`;

  return (
    <div className="space-y-5 px-4 py-5">
      {/* Category (collection name already shown in the app bar) */}
      <span className={`chip ${accent.text} ${accent.soft} border-transparent`}>
        {collection?.icon} {question.category}
      </span>

      {/* Title + scenario + question */}
      <div className="card p-5">
        <h2 className="text-2xl font-bold leading-snug">{question.title}</h2>

        {question.scenario && (
          <p className="mt-3 rounded-xl border border-line bg-paper/70 p-3.5 text-base leading-relaxed text-ink">
            {question.scenario}
          </p>
        )}

        <p className="mt-4 text-xl font-semibold leading-relaxed text-ink">{question.question}</p>

        {question.followUpQuestions && question.followUpQuestions.length > 0 && (
          <div className="mt-4 border-t border-line pt-4">
            <p className="mb-2 text-sm font-semibold text-muted">A few more to wonder about</p>
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

      {/* Optional small actions: ideas, mark as talked about, favorite */}
      <div className="flex items-center gap-2.5">
        <IconToggle
          active={showGuide}
          activeClass={activeAccent}
          label={showGuide ? "Hide ideas" : "Show ideas to talk about"}
          onClick={() => setShowGuide((v) => !v)}
        >
          <Bulb width={20} height={20} />
        </IconToggle>
        <IconToggle
          active={discussed}
          activeClass={activeAccent}
          label={discussed ? "Talked about it — tap to undo" : "Mark as talked about"}
          onClick={() => toggleDiscussed(question.id)}
        >
          <Check width={20} height={20} />
        </IconToggle>
        <IconToggle
          active={favorite}
          activeClass="border-rose-200 bg-rose-50 text-rose-500"
          label={favorite ? "Remove from favorites" : "Add to favorites"}
          onClick={() => toggleFavorite(question.id)}
        >
          <Heart filled={favorite} width={20} height={20} />
        </IconToggle>
      </div>

      {/* Guide (shown only when the ideas toggle is on) */}
      {showGuide && <GuidePanel guide={question.guide} accentClass={accent.text} />}

      {/* Primary action */}
      <button type="button" onClick={() => goToRandom(question.id)} className="btn-primary w-full text-lg">
        <Shuffle width={20} height={20} />
        Next card
      </button>
    </div>
  );
}
