// Standalone validator runnable via `npm run validate`. Verifies every bundled
// question file: required fields, well-formed guides, and globally-unique ids.
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { Question } from "../src/types/question";
import { validateQuestions } from "../src/lib/validate";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "..", "src", "data", "questions");

const files = readdirSync(dataDir).filter((f) => f.endsWith(".json"));
const all: Question[] = [];
let parseErrors = 0;

for (const file of files) {
  try {
    const parsed = JSON.parse(readFileSync(join(dataDir, file), "utf8"));
    if (!Array.isArray(parsed)) {
      console.error(`✗ ${file}: not a JSON array`);
      parseErrors++;
      continue;
    }
    console.log(`  ${file}: ${parsed.length} questions`);
    all.push(...parsed);
  } catch (e) {
    console.error(`✗ ${file}: invalid JSON — ${(e as Error).message}`);
    parseErrors++;
  }
}

const result = validateQuestions(all);

console.log(`\nTotal questions: ${all.length}`);
const byCollection = all.reduce<Record<string, number>>((acc, q) => {
  acc[q.collectionId] = (acc[q.collectionId] ?? 0) + 1;
  return acc;
}, {});
for (const [cid, count] of Object.entries(byCollection)) {
  console.log(`  ${cid}: ${count}`);
}

if (!result.ok || parseErrors > 0) {
  console.error(`\n✗ Validation FAILED with ${result.errors.length} error(s):`);
  result.errors.slice(0, 50).forEach((e) => console.error("  - " + e));
  process.exit(1);
}

console.log("\n✓ All questions valid. Unique ids confirmed.");
