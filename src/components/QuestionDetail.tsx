import { useState } from "react";
import type { ReactNode } from "react";
import type { Choice, Question } from "../types/question";
import { getCollection } from "../data/collections";
import { useProgress } from "../hooks/ProgressContext";
import { useCollectionNav } from "../hooks/useCollectionNav";
import { useSpeech } from "../hooks/useSpeech";
import GuidePanel from "./GuideReveal";
import { Bulb, Check, Heart, Shuffle, Speaker, StopIcon } from "./icons";

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

type Accent = { text: string; bg: string; border: string; soft: string };

/**
 * Choice picker for choice-based questions. The child taps an option to reveal
 * what might happen if they pick it. There's no rigid right/wrong — picking is
 * exploratory, and they can try different options. Selection is local state and
 * resets per question (QuestionDetail is remounted by id).
 */
function QuestionChoices({ choices, accent }: { choices: Choice[]; accent: Accent }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="mt-4 border-t border-line pt-4">
      <p className="mb-2.5 text-sm font-semibold text-muted">Pick what you’d do</p>
      <div className="space-y-2.5">
        {choices.map((c) => {
          const isSel = selected === c.id;
          return (
            <div key={c.id}>
              <button
                type="button"
                onClick={() => setSelected(isSel ? null : c.id)}
                aria-pressed={isSel}
                className={`flex w-full items-start gap-2.5 rounded-xl2 border p-3.5 text-left transition active:scale-[0.99] ${
                  isSel ? `${accent.border} ${accent.soft}` : "border-line bg-card hover:border-brand-200"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isSel ? `${accent.bg} text-white` : "bg-paper text-muted"
                  }`}
                >
                  {c.id.toUpperCase()}
                </span>
                <span className="font-medium leading-snug text-ink">{c.text}</span>
              </button>
              {isSel && (
                <p className="ml-9 mt-1.5 rounded-xl border border-line bg-paper/70 p-3 text-[15px] leading-relaxed text-ink">
                  {c.outcome}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
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
  const { supported: speechSupported, speaking, speak, stop } = useSpeech();
  const [showGuide, setShowGuide] = useState(false);

  const discussed = isDiscussed(question.id);
  const favorite = isFavorite(question.id);
  const activeAccent = `${accent.border} ${accent.soft} ${accent.text}`;

  // Text read aloud by the Listen button: scenario, question, then the options.
  const readAloudText = [
    question.scenario,
    question.question,
    question.choices?.length
      ? "Your choices are. " +
        question.choices.map((c) => `Option ${c.id.toUpperCase()}. ${c.text}`).join(" ")
      : ""
  ]
    .filter(Boolean)
    .join(" ");

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

        {question.choices && question.choices.length > 0 && (
          <QuestionChoices choices={question.choices} accent={accent} />
        )}

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

      {/* Optional small actions: listen, ideas, mark as talked about, favorite */}
      <div className="flex items-center gap-2.5">
        {speechSupported && (
          <IconToggle
            active={speaking}
            activeClass={activeAccent}
            label={speaking ? "Stop reading" : "Read aloud"}
            onClick={() => (speaking ? stop() : speak(readAloudText))}
          >
            {speaking ? <StopIcon width={20} height={20} /> : <Speaker width={20} height={20} />}
          </IconToggle>
        )}
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
