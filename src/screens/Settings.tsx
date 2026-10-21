import { useRef, useState } from "react";
import { COLLECTIONS } from "../data/collections";
import { getQuestionsByCollection } from "../data";
import { useProgress } from "../hooks/ProgressContext";
import { exportProgress, importProgress } from "../lib/storage";
import AppBar from "../components/AppBar";

export default function Settings() {
  const { progress, discussedSet, favoriteSet, resetCollection, replaceProgress } = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleExport = () => {
    const blob = new Blob([exportProgress(progress)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zylerverse-progress.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Progress exported.");
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const next = importProgress(String(reader.result));
        replaceProgress(next);
        setMessage("Progress imported successfully.");
      } catch {
        setMessage("Could not import — the file isn't valid progress JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = (collectionId: string, name: string) => {
    if (confirm(`Reset discussed progress for "${name}"? Favorites are kept.`)) {
      resetCollection(getQuestionsByCollection(collectionId).map((q) => q.id));
      setMessage(`Reset progress for ${name}.`);
    }
  };

  return (
    <div className="min-h-full pb-10">
      <AppBar title="Settings" backTo="/" />
      <div className="space-y-6 px-4 py-4">
        {message && (
          <p className="rounded-xl2 border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
            {message}
          </p>
        )}

        {/* Per-collection reset */}
        <section className="card p-5">
          <h2 className="mb-1 text-base font-bold">Reset progress</h2>
          <p className="mb-4 text-sm text-muted">
            Clears which questions are marked as discussed. Favorites are never affected.
          </p>
          <div className="space-y-3">
            {COLLECTIONS.map((c) => {
              const questions = getQuestionsByCollection(c.id);
              const discussed = questions.filter((q) => discussedSet.has(q.id)).length;
              return (
                <div key={c.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.icon} {c.name}</p>
                    <p className="text-sm text-muted">{discussed} of {questions.length} discussed</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleReset(c.id, c.name)}
                    disabled={discussed === 0}
                    className="btn-secondary shrink-0 px-3 py-2 text-sm"
                  >
                    Reset
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Backup */}
        <section className="card p-5">
          <h2 className="mb-1 text-base font-bold">Backup & transfer</h2>
          <p className="mb-4 text-sm text-muted">
            Export your discussed and favorite questions as a JSON file, or import it on another
            device. Both discussed status and favorites are included.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={handleExport} className="btn-secondary flex-1">
              Export progress
            </button>
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-secondary flex-1">
              Import progress
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImportFile(file);
                e.target.value = "";
              }}
            />
          </div>
          <p className="mt-3 text-xs text-muted">
            {discussedSet.size} discussed · {favoriteSet.size} favorites currently stored.
          </p>
        </section>

        <section className="px-1 text-center">
          <p className="text-sm font-semibold text-ink">Zylerverse</p>
          <p className="text-xs text-muted">Explore Ideas. Understand People.</p>
          <p className="mt-1 text-xs text-muted">All content works offline. No account, no tracking.</p>
        </section>
      </div>
    </div>
  );
}
