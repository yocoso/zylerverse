import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Question } from "../types/question";
import { useProgress } from "../hooks/ProgressContext";
import { Check, Heart, Search } from "./icons";

type StatusFilter = "all" | "not-discussed" | "discussed";

interface QuestionBrowserProps {
  questions: Question[];
  categories: string[];
  /** Accent text color class, e.g. "text-social". */
  accentClass: string;
}

/**
 * Shared, searchable/filterable list used by every collection's browser and
 * by the Favorites screen. Tapping an item opens the same QuestionDetail used
 * by the random flow. Browsing never changes discussed status.
 */
export default function QuestionBrowser({ questions, categories, accentClass }: QuestionBrowserProps) {
  const { isDiscussed, isFavorite } = useProgress();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return questions.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (status === "discussed" && !isDiscussed(item.id)) return false;
      if (status === "not-discussed" && isDiscussed(item.id)) return false;
      if (q) {
        const haystack = [
          item.title,
          item.question,
          item.scenario ?? "",
          (item.tags ?? []).join(" ")
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [questions, query, category, status, isDiscussed]);

  return (
    <div className="px-4 pb-8">
      {/* Search */}
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" width={18} height={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          inputMode="search"
          placeholder="Search questions, text, or tags"
          className="w-full rounded-xl2 border border-line bg-card py-3 pl-10 pr-3 text-base outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {/* Status filter */}
      <div className="mb-2 flex gap-2">
        {([
          ["all", "All"],
          ["not-discussed", "Not discussed"],
          ["discussed", "Discussed"]
        ] as [StatusFilter, string][]).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value)}
            className={`chip flex-1 justify-center ${status === value ? "chip-active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`chip shrink-0 ${category === "all" ? "chip-active" : ""}`}
        >
          All categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`chip shrink-0 ${category === cat ? "chip-active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="mb-3 text-sm text-muted">
        {filtered.length} question{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-xl2 border border-dashed border-line p-6 text-center text-muted">
          No questions match your filters.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((item) => {
            const discussed = isDiscussed(item.id);
            const favorite = isFavorite(item.id);
            return (
              <li key={item.id}>
                <Link
                  to={`/c/${item.collectionId}/q/${item.id}`}
                  className="card flex items-start gap-3 p-4 transition hover:border-brand-200"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`text-xs font-semibold ${accentClass}`}>{item.category}</span>
                      {favorite && <Heart filled width={14} height={14} className="text-rose-500" />}
                    </div>
                    <p className="font-semibold leading-snug">{item.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-sm text-muted">{item.question}</p>
                  </div>
                  {discussed && (
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                      <Check width={15} height={15} />
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
