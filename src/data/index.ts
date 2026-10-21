import type { Question } from "../types/question";
import { validateQuestions } from "../lib/validate";

// Question banks live in standalone JSON files, one per batch, completely
// separate from UI and progress logic. To add questions: drop in a new JSON
// file (or extend one) and add it to the array below. Nothing else changes.
import social01 from "./questions/social-01.json";
import social02 from "./questions/social-02.json";
import social03 from "./questions/social-03.json";
import social04 from "./questions/social-04.json";
import social05 from "./questions/social-05.json";
import family01 from "./questions/family-01.json";
import family02 from "./questions/family-02.json";
import family03 from "./questions/family-03.json";
import family04 from "./questions/family-04.json";
import family05 from "./questions/family-05.json";

const SOURCES: Question[][] = [
  social01 as Question[],
  social02 as Question[],
  social03 as Question[],
  social04 as Question[],
  social05 as Question[],
  family01 as Question[],
  family02 as Question[],
  family03 as Question[],
  family04 as Question[],
  family05 as Question[]
];

export const ALL_QUESTIONS: Question[] = SOURCES.flat();

// Fail loudly during development if the data is malformed or ids collide.
if (import.meta.env?.DEV) {
  const result = validateQuestions(ALL_QUESTIONS);
  if (!result.ok) {
    console.error("[Zylerverse] Question validation failed:\n" + result.errors.join("\n"));
  }
}

const BY_ID = new Map<string, Question>(ALL_QUESTIONS.map((q) => [q.id, q]));

export function getQuestionById(id: string): Question | undefined {
  return BY_ID.get(id);
}

export function getQuestionsByCollection(collectionId: string): Question[] {
  return ALL_QUESTIONS.filter((q) => q.collectionId === collectionId);
}

export function getCategories(collectionId: string): string[] {
  const set = new Set<string>();
  for (const q of ALL_QUESTIONS) {
    if (q.collectionId === collectionId) set.add(q.category);
  }
  return Array.from(set);
}
