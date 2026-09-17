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
      className="flex items-center gap-2 rounded-[2rem] border border-line-strong bg-surface p-2.5 shadow-[0_6px_30px_rgba(0,0,0,0.09)] transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent dark:border-line-dark dark:bg-surface-dark dark:focus-within:border-accent-dark dark:focus-within:ring-accent-dark sm:gap-4 sm:rounded-[2.5rem] sm:p-3 sm:pl-5"
    >
      <label htmlFor="evidence-question" className="sr-only">
        Ask a question about schizophrenia research
      </label>
      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-subtle dark:bg-surface-dark-subtle sm:inline-flex">
        <Search
          className="h-5 w-5 text-ink-muted dark:text-ink-muted-dark"
          aria-hidden="true"
        />
      </span>
      <textarea
        id="evidence-question"
        rows={Math.min(4, draft.split("\n").length)}
        wrap="off"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about symptoms, treatment, diagnosis, or family support…"
        className="min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-base leading-7 text-ink outline-none placeholder:text-ink-muted focus-visible:outline-none dark:text-ink-inverse dark:placeholder:text-ink-muted-dark sm:text-lg"
      />
      <button
        type="submit"
        aria-label={loading ? "Loading index…" : "Search evidence"}
        disabled={!canSubmit}
        className="min-h-11 shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:hover:bg-accent dark:bg-accent-dark dark:text-canvas-dark dark:hover:bg-accent-dark-hover dark:disabled:hover:bg-accent-dark sm:px-7 sm:text-base"
      >
        {loading ? "Loading…" : "Search"}
      </button>
    </form>
  );
}
