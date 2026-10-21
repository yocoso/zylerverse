import { Link, Navigate, useParams } from "react-router-dom";
import { getQuestionsByCollection } from "../data";
import { getCollection } from "../data/collections";
import { useProgress } from "../hooks/ProgressContext";
import AppBar from "../components/AppBar";
import { ListIcon } from "../components/icons";

/**
 * Shown when every question in a collection has been discussed. Offers to
 * review discussed questions or reset progress — never resets automatically.
 */
export default function Completion() {
  const { collectionId = "" } = useParams();
  const collection = getCollection(collectionId);
  const { resetCollection } = useProgress();

  if (!collection) return <Navigate to="/" replace />;
  const questions = getQuestionsByCollection(collectionId);

  const handleReset = () => {
    if (confirm(`Reset discussed progress for "${collection.name}"? Your favorites are kept.`)) {
      resetCollection(questions.map((q) => q.id));
    }
  };

  return (
    <div className="min-h-full">
      <AppBar title={collection.name} backTo="/" />
      <div className="flex flex-col items-center px-6 py-10 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-4xl">
          🎉
        </div>
        <h2 className="text-2xl font-bold">You&apos;ve explored them all!</h2>
        <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted">
          Every question in {collection.name} is marked as discussed. Revisit your favorites, browse
          again any time, or reset to start fresh.
        </p>

        <div className="mt-8 w-full max-w-xs space-y-3">
          <Link to={`/c/${collectionId}/browse`} className="btn-primary w-full">
            <ListIcon width={20} height={20} />
            Review discussed questions
          </Link>
          <button type="button" onClick={handleReset} className="btn-secondary w-full">
            Reset progress for this collection
          </button>
          <Link to="/" className="btn-ghost w-full">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
