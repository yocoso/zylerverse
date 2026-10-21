import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ALL_QUESTIONS } from "../data";
import { COLLECTIONS, getCollection } from "../data/collections";
import { useProgress } from "../hooks/ProgressContext";
import AppBar from "../components/AppBar";
import { Check, Heart } from "../components/icons";

const ACCENT: Record<string, string> = {
  social: "text-social",
  family: "text-family",
  brand: "text-brand-600"
};

export default function Favorites() {
  const { favoriteSet, isDiscussed } = useProgress();
  const [collectionFilter, setCollectionFilter] = useState<string>("all");

  const favorites = useMemo(
    () => ALL_QUESTIONS.filter((q) => favoriteSet.has(q.id)),
    [favoriteSet]
  );

  const filtered = useMemo(
    () =>
      collectionFilter === "all"
        ? favorites
        : favorites.filter((q) => q.collectionId === collectionFilter),
    [favorites, collectionFilter]
  );

  return (
    <div className="min-h-full">
      <AppBar title="Favorites" subtitle={`${favorites.length} saved`} backTo="/" />

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <Heart width={44} height={44} className="mb-4 text-rose-300" />
          <h2 className="text-lg font-bold">No favorites yet</h2>
          <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted">
            Tap the heart on any question to save it here for later — independent of whether
            you&apos;ve discussed it.
          </p>
          <Link to="/" className="btn-secondary mt-6">
            Explore collections
          </Link>
        </div>
      ) : (
        <div className="px-4 pb-10">
          {/* Collection filter */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setCollectionFilter("all")}
              className={`chip shrink-0 ${collectionFilter === "all" ? "chip-active" : ""}`}
            >
              All collections
            </button>
            {COLLECTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCollectionFilter(c.id)}
                className={`chip shrink-0 ${collectionFilter === c.id ? "chip-active" : ""}`}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-xl2 border border-dashed border-line p-6 text-center text-muted">
              No favorites in this collection.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {filtered.map((item) => {
                const collection = getCollection(item.collectionId);
                return (
                  <li key={item.id}>
                    <Link
                      to={`/c/${item.collectionId}/q/${item.id}`}
                      className="card flex items-start gap-3 p-4 transition hover:border-brand-200"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className={`text-xs font-semibold ${ACCENT[collection?.accent ?? "brand"]}`}>
                            {collection?.icon} {item.category}
                          </span>
                        </div>
                        <p className="font-semibold leading-snug">{item.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-sm text-muted">{item.question}</p>
                      </div>
                      {isDiscussed(item.id) && (
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
      )}
    </div>
  );
}
