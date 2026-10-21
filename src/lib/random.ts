import type { Question } from "../types/question";

/**
 * Picks a random question from `questions` that is NOT in `discussedIds`,
 * optionally excluding `excludeId` (the currently-shown question) as long as
 * other undiscussed options remain.
 *
 * Returns null when every question is discussed (the completion state).
 */
export function pickRandomUndiscussed(
  questions: Question[],
  discussedIds: Set<string>,
  excludeId?: string
): Question | null {
  const undiscussed = questions.filter((q) => !discussedIds.has(q.id));
  if (undiscussed.length === 0) return null;

  // Avoid repeating the current question when alternatives exist.
  const pool =
    excludeId && undiscussed.length > 1
      ? undiscussed.filter((q) => q.id !== excludeId)
      : undiscussed;

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
