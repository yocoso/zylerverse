import type { UserProgress } from "../types/progress";
import { EMPTY_PROGRESS } from "../types/progress";

const STORAGE_KEY = "zylerverse.progress.v1";

/**
 * Loads progress, tolerating older/partial shapes. Unknown or corrupt data
 * falls back to empty progress rather than throwing.
 */
export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return normalize(parsed);
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage may be unavailable (private mode / quota). Progress stays in
    // memory for the session; nothing else to do.
  }
}

/** Coerces any stored/imported object into a valid UserProgress. */
export function normalize(data: Partial<UserProgress> | null | undefined): UserProgress {
  const discussed = Array.isArray(data?.discussedQuestionIds)
    ? data!.discussedQuestionIds.filter((x) => typeof x === "string")
    : [];
  const favorites = Array.isArray(data?.favoriteQuestionIds)
    ? data!.favoriteQuestionIds.filter((x) => typeof x === "string")
    : [];
  return {
    version: 1,
    discussedQuestionIds: Array.from(new Set(discussed)),
    favoriteQuestionIds: Array.from(new Set(favorites))
  };
}

export function exportProgress(progress: UserProgress): string {
  return JSON.stringify(progress, null, 2);
}

/** Parses an imported JSON string into valid progress, or throws on bad JSON. */
export function importProgress(json: string): UserProgress {
  const parsed = JSON.parse(json) as Partial<UserProgress>;
  return normalize(parsed);
}
