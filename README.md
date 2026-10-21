# Zylerverse

**Explore Ideas. Understand People.**

A clean, mobile-first PWA of pre-generated discussion prompts for parents and
children (ages 8–11). Not a quiz, test, or chatbot — just thoughtful
conversation cards that work fully offline.

## Collections

- **Social Thinking** — 120 realistic scenarios building perspective-taking,
  empathy, boundaries, and social reasoning. Each has a discussion guide with
  *Possible Explanations, Perspective Taking, Things to Consider, Possible
  Responses,* and a *Key Takeaway*.
- **Family Conversations** — 120 open-ended prompts for the whole family, with
  *Follow-Up Questions, Interesting Angles, a Family Activity,* and a
  *Conversation Takeaway*.

240 original questions total, all bundled with the app.

## Tech stack

React + TypeScript · Tailwind CSS · React Router (HashRouter) · vite-plugin-pwa.
No backend, no auth, no database, no runtime AI. Progress and favorites persist
in LocalStorage.

## Scripts

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build (emits PWA service worker)
npm run preview    # serve the production build
npm run validate   # validate all question data (required fields, unique ids)
```

## Architecture

| Concern | Location |
| --- | --- |
| Shared data model | `src/types/` |
| Collection config (the only per-collection code) | `src/data/collections.ts` |
| Question banks (standalone JSON) | `src/data/questions/*.json` |
| Data assembly + lookups | `src/data/index.ts` |
| Centralized progress + favorites | `src/hooks/ProgressContext.tsx` |
| Reusable random selection | `src/lib/random.ts` |
| Shared reading experience | `src/components/QuestionDetail.tsx` |
| Shared browser | `src/components/QuestionBrowser.tsx` |
| Data validation | `src/lib/validate.ts` |

### Adding a collection or questions

1. Drop a JSON file into `src/data/questions/` (array of `Question` objects with
   globally-unique `id`s) and add it to the imports in `src/data/index.ts`.
2. For a new collection, add one entry to `COLLECTIONS` in
   `src/data/collections.ts`.

No navigation, detail, browser, or progress code needs to change. Questions are
tracked by stable `id`, so adding new ones never disturbs existing progress —
they simply appear as undiscussed and not favorited. Run `npm run validate` to
confirm required fields and unique ids.

### Progress model

```ts
type UserProgress = {
  version: 1;
  discussedQuestionIds: string[];
  favoriteQuestionIds: string[];
};
```

Discussed status and favorites are independent. Both are included in
Settings → Export / Import for backup and moving between devices. Progress is
never reset automatically; reset is per-collection and confirmed.
