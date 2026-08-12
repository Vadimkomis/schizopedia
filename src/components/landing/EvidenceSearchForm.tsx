import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Search } from "lucide-react";

export interface EvidenceSearchFormProps {
  loading: boolean;
  disabled: boolean;
  onSubmit: (query: string) => void;
}

export function EvidenceSearchForm({
  loading,
  disabled,
  onSubmit,
}: EvidenceSearchFormProps) {
  const [draft, setDraft] = useState("");
  const canSubmit = !loading && !disabled && draft.trim().length > 0;

  const submitDraft = () => {
    if (canSubmit) onSubmit(draft.trim());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitDraft();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitDraft();
    }
  };

  return (
    <form
      role="search"
      aria-label="Schizopedia evidence search"
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-surface p-3 shadow-sm dark:border-line-dark dark:bg-surface-dark"
    >
      <label htmlFor="evidence-question" className="sr-only">
        Ask a question about schizophrenia research
      </label>
      <div className="flex items-start gap-3">
        <Search
          className="mt-3 h-5 w-5 shrink-0 text-ink-muted dark:text-ink-muted-dark"
          aria-hidden="true"
        />
        <textarea
          id="evidence-question"
          rows={2}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about symptoms, treatment, diagnosis, or family support…"
          className="min-h-20 flex-1 resize-none bg-transparent px-1 py-2 text-base text-ink outline-none placeholder:text-ink-muted dark:text-ink-inverse dark:placeholder:text-ink-muted-dark sm:text-lg"
        />
      </div>
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-45 dark:bg-accent-dark dark:text-canvas-dark dark:hover:bg-accent-dark-hover"
        >
          {loading ? "Loading index…" : "Search evidence"}
        </button>
      </div>
    </form>
  );
}
