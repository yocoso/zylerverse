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
        <div className="mb-3 flex items-center gap-3.5">
          <span className={`flex h-14 w-14 items-center justify-center rounded-xl2 text-3xl ${accent.soft}`}>
            {collection.icon}
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold leading-tight">{collection.name}</h2>
            <p className={`text-sm font-semibold ${accent.text}`}>
              {done ? "All done! 🎉" : discussed > 0 ? `${discussed} of ${total} done` : `${total} cards`}
            </p>
          </div>
        </div>

        <p className="mb-4 text-[15px] leading-relaxed text-muted">{collection.description}</p>

        {discussed > 0 && (
          <div className="mb-4">
            <ProgressBar value={discussed} max={total} colorClass={accent.bar} />
          </div>
        )}

        <div className="flex gap-2">
          <button type="button" onClick={() => goToRandom()} className="btn-primary flex-1 text-lg">
            <Shuffle width={20} height={20} />
            {done ? "Review" : discussed > 0 ? "Continue" : "Let's go"}
          </button>
          <Link
            to={`/c/${collectionId}/browse`}
            className="btn-secondary px-4"
            aria-label={`Browse all ${collection.name} cards`}
          >
            <ListIcon width={20} height={20} />
            All
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
      <main className="space-y-4 px-4 pt-5">
        {COLLECTIONS.map((c) => (
          <CollectionCard key={c.id} collectionId={c.id} />
        ))}
      </main>
    </div>
  );
}
