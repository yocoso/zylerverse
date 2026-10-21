import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { UserProgress } from "../types/progress";
import { loadProgress, saveProgress, normalize } from "../lib/storage";

// Centralized progress management. All discussed/favorite reads and writes go
// through this one context so persistence stays in a single place.

interface ProgressContextValue {
  progress: UserProgress;
  discussedSet: Set<string>;
  favoriteSet: Set<string>;
  isDiscussed: (id: string) => boolean;
  isFavorite: (id: string) => boolean;
  setDiscussed: (id: string, discussed: boolean) => void;
  toggleDiscussed: (id: string) => void;
  setFavorite: (id: string, favorite: boolean) => void;
  toggleFavorite: (id: string) => void;
  /** Reset discussed progress for one collection. Favorites are kept. */
  resetCollection: (questionIds: string[]) => void;
  replaceProgress: (next: UserProgress) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const firstRender = useRef(true);

  // Persist on every change (skip the initial load).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    saveProgress(progress);
  }, [progress]);

  // Keep multiple tabs / windows in sync.
  useEffect(() => {
    const onStorage = () => setProgress(loadProgress());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const discussedSet = useMemo(
    () => new Set(progress.discussedQuestionIds),
    [progress.discussedQuestionIds]
  );
  const favoriteSet = useMemo(
    () => new Set(progress.favoriteQuestionIds),
    [progress.favoriteQuestionIds]
  );

  const setDiscussed = useCallback((id: string, discussed: boolean) => {
    setProgress((prev) => {
      const has = prev.discussedQuestionIds.includes(id);
      if (discussed === has) return prev;
      return {
        ...prev,
        discussedQuestionIds: discussed
          ? [...prev.discussedQuestionIds, id]
          : prev.discussedQuestionIds.filter((x) => x !== id)
      };
    });
  }, []);

  const toggleDiscussed = useCallback(
    (id: string) =>
      setProgress((prev) => ({
        ...prev,
        discussedQuestionIds: prev.discussedQuestionIds.includes(id)
          ? prev.discussedQuestionIds.filter((x) => x !== id)
          : [...prev.discussedQuestionIds, id]
      })),
    []
  );

  const setFavorite = useCallback((id: string, favorite: boolean) => {
    setProgress((prev) => {
      const has = prev.favoriteQuestionIds.includes(id);
      if (favorite === has) return prev;
      return {
        ...prev,
        favoriteQuestionIds: favorite
          ? [...prev.favoriteQuestionIds, id]
          : prev.favoriteQuestionIds.filter((x) => x !== id)
      };
    });
  }, []);

  const toggleFavorite = useCallback(
    (id: string) =>
      setProgress((prev) => ({
        ...prev,
        favoriteQuestionIds: prev.favoriteQuestionIds.includes(id)
          ? prev.favoriteQuestionIds.filter((x) => x !== id)
          : [...prev.favoriteQuestionIds, id]
      })),
    []
  );

  const resetCollection = useCallback((questionIds: string[]) => {
    const toRemove = new Set(questionIds);
    setProgress((prev) => ({
      ...prev,
      discussedQuestionIds: prev.discussedQuestionIds.filter((id) => !toRemove.has(id))
    }));
  }, []);

  const replaceProgress = useCallback((next: UserProgress) => {
    setProgress(normalize(next));
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      discussedSet,
      favoriteSet,
      isDiscussed: (id) => discussedSet.has(id),
      isFavorite: (id) => favoriteSet.has(id),
      setDiscussed,
      toggleDiscussed,
      setFavorite,
      toggleFavorite,
      resetCollection,
      replaceProgress
    }),
    [progress, discussedSet, favoriteSet, setDiscussed, toggleDiscussed, setFavorite, toggleFavorite, resetCollection, replaceProgress]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
}
