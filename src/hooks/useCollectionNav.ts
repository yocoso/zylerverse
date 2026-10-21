import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestionsByCollection } from "../data";
import { pickRandomUndiscussed } from "../lib/random";
import { useProgress } from "./ProgressContext";

/**
 * Shared random-selection navigation for a collection. Used both by the
 * collection entry point and the "Next Random Question" button so the logic
 * lives in exactly one place.
 */
export function useCollectionNav(collectionId: string) {
  const navigate = useNavigate();
  const { discussedSet } = useProgress();

  const goToRandom = useCallback(
    (excludeId?: string, replace = false) => {
      const questions = getQuestionsByCollection(collectionId);
      const next = pickRandomUndiscussed(questions, discussedSet, excludeId);
      if (next) {
        navigate(`/c/${collectionId}/q/${next.id}`, { replace });
      } else {
        navigate(`/c/${collectionId}/done`, { replace });
      }
    },
    [collectionId, discussedSet, navigate]
  );

  return { goToRandom };
}
