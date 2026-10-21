import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getCollection } from "../data/collections";
import { useCollectionNav } from "../hooks/useCollectionNav";

/**
 * Entry point for a collection: immediately picks a random undiscussed question
 * (or the completion screen) and replaces this route in history so Back from
 * the question returns Home rather than re-triggering a random pick.
 */
export default function RandomEntry() {
  const { collectionId = "" } = useParams();
  const collection = getCollection(collectionId);
  const { goToRandom } = useCollectionNav(collectionId);

  useEffect(() => {
    if (collection) goToRandom(undefined, true);
  }, [collection, goToRandom]);

  if (!collection) return <Navigate to="/" replace />;
  return <div className="p-8 text-center text-muted">Finding a question…</div>;
}
