import { Link } from "react-router-dom";
import { COLLECTIONS } from "../data/collections";
import { getQuestionsByCollection } from "../data";
import { useProgress } from "../hooks/ProgressContext";
import { useCollectionNav } from "../hooks/useCollectionNav";
import BrandHeader from "../components/BrandHeader";
import ProgressBar from "../components/ProgressBar";
import { ListIcon, Shuffle } from "../components/icons";

const ACCENT: Record<string, { bar: string; soft: string; text: string }> = {
  social: { bar: "bg-social", soft: "bg-social/10", text: "text-social" },
  family: { bar: "bg-family", soft: "bg-family/10", text: "text-family" },
  brand: { bar: "bg-brand-500", soft: "bg-brand-50", text: "text-brand-600" }
};

function CollectionCard({ collectionId }: { collectionId: string }) {
  const { discussedSet } = useProgress();
  const { goToRandom } = useCollectionNav(collectionId);

  const collection = COLLECTIONS.find((c) => c.id === collectionId)!;
  const questions = getQuestionsByCollection(collectionId);
  const total = questions.length;
  const discussed = questions.filter((q) => discussedSet.has(q.id)).length;
  const accent = ACCENT[collection.accent];
  const done = total > 0 && discussed === total;

  return (
    <div className="card overflow-hidden">
      <div className="p-5">
        <div className="mb-3 flex items-center gap-3">
          <span className={`flex h-12 w-12 items-center justify-center rounded-xl2 text-2xl ${accent.soft}`}>
            {collection.icon}
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-bold leading-tight">{collection.name}</h2>
            <p className={`text-sm font-semibold ${accent.text}`}>
              {done ? "All discussed 🎉" : `${total - discussed} to explore`}
            </p>
          </div>
        </div>

        <p className="mb-4 text-[15px] leading-relaxed text-muted">{collection.description}</p>

        <div className="mb-4">
          <div className="mb-1.5 flex justify-between text-xs font-medium text-muted">
            <span>{discussed} of {total} discussed</span>
            <span>{total > 0 ? Math.round((discussed / total) * 100) : 0}%</span>
          </div>
          <ProgressBar value={discussed} max={total} colorClass={accent.bar} />
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => goToRandom()} className="btn-primary flex-1">
            <Shuffle width={20} height={20} />
            {discussed > 0 && !done ? "Continue" : "Start"}
          </button>
          <Link
            to={`/c/${collectionId}/browse`}
            className="btn-secondary px-4"
            aria-label={`Browse ${collection.name}`}
          >
            <ListIcon width={20} height={20} />
            Browse
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-full pb-10">
      <BrandHeader />
      <main className="space-y-4 px-4 pt-4">
        <p className="px-1 text-[15px] leading-relaxed text-muted">
          Pick a collection to open a conversation card. No scores, no quizzes — just good talks.
        </p>
        {COLLECTIONS.map((c) => (
          <CollectionCard key={c.id} collectionId={c.id} />
        ))}
      </main>
    </div>
  );
}
