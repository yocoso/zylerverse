// Shared data model for all collections. Both collections use this exact shape
// and the same QuestionDetail / QuestionBrowser components.

export type Difficulty = "easy" | "medium" | "advanced";

export interface GuideSection {
  heading: string;
  content: string[];
}

export interface Guide {
  sections: GuideSection[];
}

export interface Question {
  id: string;
  collectionId: string;
  category: string;
  title: string;
  /** Present for scenario-based collections (e.g. Social Thinking). */
  scenario?: string;
  question: string;
  followUpQuestions?: string[];
  guide: Guide;
  difficulty?: Difficulty;
  tags?: string[];
}

/**
 * A collection is configuration-driven: adding a new one requires only a
 * CollectionConfig entry plus its question data file — no UI changes.
 */
export interface CollectionConfig {
  id: string;
  name: string;
  description: string;
  /** One of the collection accent colors defined in tailwind.config.js */
  accent: "social" | "family" | "brand";
  /** Emoji used as the lightweight collection icon. */
  icon: string;
  /** Short label shown on the detail screen, e.g. "Scenario" vs "Prompt". */
  promptKind: "scenario" | "prompt";
}
