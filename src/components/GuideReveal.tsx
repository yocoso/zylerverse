import type { Guide } from "../types/question";

interface GuidePanelProps {
  guide: Guide;
  /** Tailwind text color class for the accent used on headings. */
  accentClass: string;
}

/**
 * The discussion-guide panel. Purely presentational — the parent
 * (QuestionDetail) owns the show/hide state via a small icon toggle, and only
 * mounts this when the guide is revealed. Because QuestionDetail is remounted
 * per question, the guide always starts hidden on a new question.
 */
export default function GuidePanel({ guide, accentClass }: GuidePanelProps) {
  return (
    <div className="space-y-5 rounded-xl2 border border-line bg-paper/60 p-4">
      {guide.sections.map((section, i) => (
        <section key={i}>
          <h3 className={`mb-2 text-base font-bold ${accentClass}`}>{section.heading}</h3>
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
  );
}
