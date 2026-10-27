import type { CollectionConfig } from "../types/question";

// The single source of truth for which collections exist. The home screen,
// router, browser and detail screens all read from here — nothing is hard-coded
// per collection anywhere else.
export const COLLECTIONS: CollectionConfig[] = [
  {
    id: "what-would-you-do",
    name: "What Would You Do?",
    description:
      "Everyday situations — with your little sister, at school, and around the house — where you pick what you'd do.",
    accent: "social",
    icon: "🤔",
    promptKind: "scenario"
  },
  {
    id: "family-conversations",
    name: "Family Conversations",
    description:
      "Open-ended prompts that spark meaningful — and sometimes funny — talks for the whole family.",
    accent: "family",
    icon: "💬",
    promptKind: "prompt"
  }
];

export function getCollection(id: string): CollectionConfig | undefined {
  return COLLECTIONS.find((c) => c.id === id);
}
