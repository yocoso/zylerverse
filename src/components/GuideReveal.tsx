import { useState } from "react";
import type { Guide } from "../types/question";
import { ChevronDown } from "./icons";

interface GuideRevealProps {
  guide: Guide;
  /** Tailwind text color class for the accent used on headings. */
  accentClass: string;
}

/**
 * The discussion guide, hidden by default. Expands inline below the question
 * and can be collapsed again. Because QuestionDetail is remounted per question
 * (keyed by id), the guide always starts hidden on a new question.
 */
export default function GuideReveal({ guide, accentClass }: GuideRevealProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="btn-secondary w-full"
      >
        <ChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          width={20}
          height={20}
        />
        {open ? "Hide Discussion Guide" : "Reveal Discussion Guide"}
      </button>

      {open && (
        <div className="mt-4 space-y-5 rounded-xl2 border border-line bg-paper/60 p-4">
          {guide.sections.map((section, i) => (
            <section key={i}>
              <h3 className={`mb-2 text-sm font-bold uppercase tracking-wide ${accentClass}`}>
                {section.heading}
              </h3>
              <ul className="space-y-2">
                {section.content.map((item, j) => (
                  <li key={j} className="flex gap-2 text-[15px] leading-relaxed text-ink">
                    <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accentClass.replace("text-", "bg-")}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
