import type { Question } from "../types/question";
import { COLLECTIONS } from "../data/collections";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

const VALID_COLLECTION_IDS = new Set(COLLECTIONS.map((c) => c.id));

/**
 * Validates a flat list of questions: required fields, well-formed guides,
 * known collection ids, and globally-unique ids across all collections.
 */
export function validateQuestions(questions: Question[]): ValidationResult {
  const errors: string[] = [];
  const seen = new Map<string, number>();

  questions.forEach((q, i) => {
    const where = `[${i}] ${q?.id ?? "<no id>"}`;
    if (!q.id || typeof q.id !== "string") errors.push(`${where}: missing/invalid id`);
    if (!q.collectionId) errors.push(`${where}: missing collectionId`);
    else if (!VALID_COLLECTION_IDS.has(q.collectionId))
      errors.push(`${where}: unknown collectionId "${q.collectionId}"`);
    if (!q.category) errors.push(`${where}: missing category`);
    if (!q.title) errors.push(`${where}: missing title`);
    if (!q.question) errors.push(`${where}: missing question`);
    if (!q.guide || !Array.isArray(q.guide.sections) || q.guide.sections.length === 0)
      errors.push(`${where}: missing guide sections`);
    else {
      q.guide.sections.forEach((s, si) => {
        if (!s.heading) errors.push(`${where}: guide section ${si} missing heading`);
        if (!Array.isArray(s.content) || s.content.length === 0)
          errors.push(`${where}: guide section "${s.heading}" has empty content`);
      });
    }

    if (q.id) {
      if (seen.has(q.id)) errors.push(`${where}: duplicate id (also at index ${seen.get(q.id)})`);
      else seen.set(q.id, i);
    }
  });

  return { ok: errors.length === 0, errors };
}
