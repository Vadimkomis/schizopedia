# Simple Evidence Search Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the crowded landing page with a restrained, accessible evidence-search experience that returns cautious PubMed-linked results inline and remains polished in light and dark modes.

**Architecture:** Keep `useResearchData()` as the only runtime source and `synthesizeEvidence()` as the deterministic search engine. Split the landing experience into a state-owning `HeroSection`, a controlled-submission `EvidenceSearchForm`, read-only answer/citation components, static topic links, and a simplified latest-studies list. Apply semantic clinical color tokens through Tailwind and shared layout primitives so every existing route inherits the redesign without changing its content model.

**Tech Stack:** React 18, TypeScript, React Router, Vite 5, Tailwind CSS 3, Vitest, Testing Library, Playwright visual checks, existing Public Sans/Newsreader fonts.

## Global Constraints

- Implement against the approved design in `docs/superpowers/specs/2026-08-11-simple-evidence-search-redesign-design.md`.
- Add no production dependency, backend, external search service, telemetry, query persistence, or URL serialization.
- Preserve all existing routes, PubMed data files, refresh scripts, sitemap generation, SSR/prerender behavior, and persisted theme behavior.
- Keep search summaries strictly derived from stored title, study type, abstract snippet, and evidence-level fields.
- Use `apply_patch` for text-file edits. Preserve the user-owned untracked `.superpowers/` directory.
- Follow red-green-refactor: add the named failing test, observe the expected failure, make the smallest implementation, then rerun the focused test.
- Run `npm test` after every JavaScript/TypeScript/TSX implementation batch, as required by `AGENTS.md`. Use `pnpm` for existing project commands.
- Do not install anything. If an unexpected dependency appears necessary, stop and ask the user first.
- Use safe external-link attributes on every PubMed link: `target="_blank" rel="noreferrer noopener"`.
- Commit only files named by the current task; do not add `.superpowers/`, generated `dist*`, or `screenshots/` artifacts.

## File Structure Map

### New files

- `src/lib/topics.ts` — one shared definition of the four topic destinations.
- `src/components/landing/EvidenceSearchForm.tsx` — textarea, keyboard behavior, loading label, and submission gate.
- `src/components/landing/EvidenceSearchForm.test.tsx` — keyboard and disabled-state contract.
- `src/components/landing/EvidenceAnswer.tsx` — live result region, focus movement, signal, summary, disclaimer, and no-match links.
- `src/components/landing/EvidenceAnswer.test.tsx` — result, focus, citation, and no-match contract.
- `src/components/landing/EvidenceCitationList.tsx` — numbered PubMed citations and stored metadata.
- `src/components/landing/BrowseTopics.tsx` — compact links to the four existing category routes.
- `src/components/landing/BrowseTopics.test.tsx` — topic labels and route contract.
- `src/components/layout/PageLayout.test.tsx` — semantic light/dark shell contract.

### Replaced or substantially changed files

- `src/lib/evidenceSearch.ts`
- `src/lib/evidenceSearch.test.ts`
- `src/components/landing/HeroSection.tsx`
- `src/components/landing/HeroSection.test.tsx`
- `src/components/landing/LatestHighlights.tsx`
- `src/components/landing/LatestHighlights.test.tsx`
- `src/components/landing/SiteNav.tsx`
- `src/components/landing/SiteNav.test.tsx`
- `src/components/landing/SiteFooter.tsx`
- `src/components/landing/SiteFooter.test.tsx`
- `src/pages/LandingPage.tsx`
- `src/pages/LandingPage.test.tsx`
- `tailwind.config.js`
- `src/index.css`
- `src/components/layout/PageLayout.tsx`
- `src/components/ui/card.tsx`
- active category/guide/prevalence/donation/legal surface components listed in Task 10
- `src/lib/seo.ts`
- `src/lib/seo.test.ts`
- `scripts/prerender.mjs`
- `scripts/visualCheck.mjs`
- `features.md`
- `CLAUDE.md`

### Deleted after reference verification

- `src/components/landing/HighlightCard.tsx`
- `src/components/landing/HighlightCard.test.tsx`
- `src/components/landing/BrainScene.tsx`
- `src/components/landing/BrainIllustration.tsx`
- `src/components/landing/BrainIllustration.test.tsx`
- `public/brain-aerial.svg`
- `public/hero-brain.jpg`
- `public/hero-brain.webp`

---

## Task 1: Enforce textual relevance before evidence bonuses

**Files:**

- Modify: `src/lib/evidenceSearch.test.ts`
- Modify: `src/lib/evidenceSearch.ts`

**Interfaces:**

- Consumes: `query: string`, `categories: ResearchCategory[]`, and `publishedTimestamp()`.
- Produces: the existing `EvidenceSynthesis` shape; export `MIN_RELEVANCE_SCORE = 3` as the explicit qualification rule.
- Invariant: `EvidenceMatch.score` is the final ordering score, but qualification is decided only by the pre-bonus textual score.

- [ ] **Step 1: Add ranking contract tests**

Append focused cases that prove phrase priority, weak-match exclusion, date tie-breaking, result capping, and clinical caution:

```ts
it("ranks an exact title phrase above token-only matches", () => {
  const result = synthesizeEvidence("family support", [
    {
      id: "care",
      title: "Care",
      summary: "Care research.",
      articles: [
        {
          id: "partial",
          title: "Support services for caregivers",
          snippet: "Family programs can help continuity.",
          url: "https://pubmed.ncbi.nlm.nih.gov/partial/",
          evidenceLevel: "synthesis",
          published: "2026-08-10",
        },
        {
          id: "exact",
          title: "Family support after a first episode",
          url: "https://pubmed.ncbi.nlm.nih.gov/exact/",
          evidenceLevel: "exploratory",
          published: "2024-01-01",
        },
      ],
    },
  ]);

  expect(result.matches[0]?.article.id).toBe("exact");
});

it("does not let an evidence bonus qualify one weak snippet hit", () => {
  const result = synthesizeEvidence("psychosis", [
    {
      id: "care",
      title: "Care",
      summary: "General care research.",
      articles: [
        {
          id: "weak-review",
          title: "A broad systematic review",
          snippet: "Psychosis is mentioned once.",
          url: "https://pubmed.ncbi.nlm.nih.gov/weak/",
          evidenceLevel: "synthesis",
        },
      ],
    },
  ]);

  expect(result.matches).toHaveLength(0);
  expect(result.directMatch).toBe(false);
});

it("breaks equal relevance scores by newest publication", () => {
  const result = synthesizeEvidence("cognitive training", [
    {
      id: "treatment",
      title: "Treatment",
      summary: "Intervention research.",
      articles: [
        {
          id: "older",
          title: "Cognitive training outcomes in psychosis",
          url: "https://pubmed.ncbi.nlm.nih.gov/older/",
          published: "2024-01-01",
        },
        {
          id: "newer",
          title: "Cognitive training outcomes after diagnosis",
          url: "https://pubmed.ncbi.nlm.nih.gov/newer/",
          published: "2026-01-01",
        },
      ],
    },
  ]);

  expect(result.matches.map(({ article }) => article.id)).toEqual([
    "newer",
    "older",
  ]);
});

it("returns no more than three qualified matches", () => {
  const articles = Array.from({ length: 4 }, (_, index) => ({
    id: String(index),
    title: `Cognitive training study ${index}`,
    url: `https://pubmed.ncbi.nlm.nih.gov/${index}/`,
  }));

  const result = synthesizeEvidence("cognitive training", [
    { id: "treatment", title: "Treatment", summary: "Care.", articles },
  ]);

  expect(result.matches).toHaveLength(3);
});

it("describes clinical-only evidence without claiming causation", () => {
  const result = synthesizeEvidence("relapse outcomes", [
    {
      id: "treatment",
      title: "Treatment",
      summary: "Care.",
      articles: [
        {
          id: "clinical",
          title: "Relapse outcomes in community care",
          url: "https://pubmed.ncbi.nlm.nih.gov/clinical/",
          studyType: "Observational study",
          evidenceLevel: "clinical",
        },
      ],
    },
  ]);

  expect(result.signal).toBe("Clinical signal");
  expect(result.answer).toMatch(/cannot prove cause and effect/i);
});
```

- [ ] **Step 2: Run the focused test and observe the weak-match failure**

Run: `pnpm exec vitest run src/lib/evidenceSearch.test.ts`

Expected: the weak synthesis snippet is incorrectly returned because its evidence bonus currently pushes it above zero.

- [ ] **Step 3: Split textual score from evidence ordering score**

Replace the numeric scorer with the explicit threshold and bonus separation:

```ts
export const MIN_RELEVANCE_SCORE = 3;

function scoreArticleText(
  query: string,
  tokens: Set<string>,
  article: ResearchArticle,
  category: ResearchCategory,
): number {
  const title = normalize(article.title);
  const snippet = normalize(article.snippet ?? "");
  const metadata = normalize(
    [
      article.studyType,
      article.evidenceLevel,
      article.actionability,
      ...(article.categoryTags ?? []),
    ]
      .filter(Boolean)
      .join(" "),
  );
  const categoryText = normalize(
    `${category.id} ${category.title} ${category.summary}`,
  );
  const normalizedQuery = normalize(query);
  let score = 0;

  if (normalizedQuery.length > 5 && title.includes(normalizedQuery)) score += 16;
  if (normalizedQuery.length > 5 && snippet.includes(normalizedQuery)) score += 8;

  tokens.forEach((token) => {
    if (title.includes(token)) score += 5;
    if (snippet.includes(token)) score += 2;
    if (metadata.includes(token)) score += 2;
    if (categoryText.includes(token)) score += 1;
  });

  return score;
}

function evidenceBonus(article: ResearchArticle): number {
  if (article.evidenceLevel === "synthesis") return 2;
  if (article.evidenceLevel === "clinical") return 1;
  return 0;
}
```

Build candidates with both scores, filter on `textScore`, then sort on the final score and date:

```ts
const matches = categories
  .flatMap((category) =>
    (category.articles ?? []).map((article) => {
      const textScore = scoreArticleText(cleanQuery, tokens, article, category);
      return {
        article,
        category: { id: category.id, title: category.title },
        textScore,
        score: textScore + evidenceBonus(article),
      };
    }),
  )
  .filter(({ textScore }) => textScore >= MIN_RELEVANCE_SCORE)
  .sort(
    (a, b) =>
      b.score - a.score ||
      publishedTimestamp(b.article.published) -
        publishedTimestamp(a.article.published),
  )
  .slice(0, Math.min(limit, 3))
  .map(({ article, category, score }) => ({ article, category, score }));
```

- [ ] **Step 4: Run the focused test and verify all ranking cases pass**

Run: `pnpm exec vitest run src/lib/evidenceSearch.test.ts`

Expected: PASS.

- [ ] **Step 5: Run the repository-required suite**

Run: `npm test`

Expected: PASS.

- [ ] **Step 6: Commit the ranking contract**

```bash
git add src/lib/evidenceSearch.ts src/lib/evidenceSearch.test.ts
git commit -m "test: enforce evidence relevance threshold"
```

---

## Task 2: Add the accessible evidence search form

**Files:**

- Create: `src/components/landing/EvidenceSearchForm.test.tsx`
- Create: `src/components/landing/EvidenceSearchForm.tsx`

**Interfaces:**

- Consumes: `loading: boolean`, `disabled: boolean`, and `onSubmit(query: string)`.
- Produces: a trimmed non-empty query only after an intentional submit.
- Owns: draft textarea state. It does not own or clear the submitted result.

- [ ] **Step 1: Write form behavior tests**

```tsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EvidenceSearchForm } from "./EvidenceSearchForm";
import { renderWithRouter } from "@/test/render";

describe("EvidenceSearchForm", () => {
  it("keeps submission disabled until the trimmed question has content", async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <EvidenceSearchForm loading={false} disabled={false} onSubmit={vi.fn()} />,
    );

    const button = screen.getByRole("button", { name: /search evidence/i });
    expect(button).toBeDisabled();
    await user.type(screen.getByRole("textbox"), "medication adherence");
    expect(button).toBeEnabled();
  });

  it("submits a trimmed question with Enter", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    renderWithRouter(
      <EvidenceSearchForm loading={false} disabled={false} onSubmit={onSubmit} />,
    );

    await user.type(screen.getByRole("textbox"), "  family support{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("family support");
  });

  it("inserts a newline and does not submit with Shift+Enter", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    renderWithRouter(
      <EvidenceSearchForm loading={false} disabled={false} onSubmit={onSubmit} />,
    );

    const field = screen.getByRole("textbox");
    await user.type(field, "family{Shift>}{Enter}{/Shift}support");
    expect(field).toHaveValue("family\nsupport");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows the loading label and blocks submission", () => {
    renderWithRouter(
      <EvidenceSearchForm loading disabled onSubmit={vi.fn()} />,
    );

    expect(screen.getByRole("button", { name: /loading index/i })).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run the test and observe the missing-module failure**

Run: `pnpm exec vitest run src/components/landing/EvidenceSearchForm.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the form with one submission path**

```tsx
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
```

- [ ] **Step 4: Run the focused test**

Run: `pnpm exec vitest run src/components/landing/EvidenceSearchForm.test.tsx`

Expected: PASS.

- [ ] **Step 5: Run all tests and commit**

Run: `npm test`

```bash
git add src/components/landing/EvidenceSearchForm.tsx src/components/landing/EvidenceSearchForm.test.tsx
git commit -m "feat: add accessible evidence search form"
```

---

## Task 3: Render focused, source-linked answers and honest no-match links

**Files:**

- Create: `src/lib/topics.ts`
- Create: `src/components/landing/EvidenceCitationList.tsx`
- Create: `src/components/landing/EvidenceAnswer.test.tsx`
- Create: `src/components/landing/EvidenceAnswer.tsx`

**Interfaces:**

- `TOPIC_LINKS` produces immutable `{ label, to }` values for Cure, Diagnosis, Treatment, and Prevention/early support.
- `EvidenceCitationList` consumes `matches: EvidenceMatch[]` and renders stored metadata only.
- `EvidenceAnswer` consumes the submitted `query` and immutable `EvidenceSynthesis`; it owns only focus behavior.

- [ ] **Step 1: Add result and no-match component tests**

Use a full synthesis fixture and assert focus, live-region semantics, stored metadata, safe links, disclaimer text, and all four fallback routes:

```tsx
import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EvidenceAnswer } from "./EvidenceAnswer";
import { renderWithRouter } from "@/test/render";
import type { EvidenceSynthesis } from "@/lib/evidenceSearch";

const matched: EvidenceSynthesis = {
  answer: "The strongest match is a systematic review examining medication adherence.",
  directMatch: true,
  signal: "Synthesis-led",
  signalDetail: "1 review among the strongest matches",
  matches: [
    {
      score: 12,
      category: { id: "treatment", title: "Treatment" },
      article: {
        id: "review",
        title: "Medication adherence review",
        url: "https://pubmed.ncbi.nlm.nih.gov/review/",
        journal: "JAMA Psychiatry",
        studyType: "Systematic review",
        published: "2026-07-12",
      },
    },
  ],
};

describe("EvidenceAnswer", () => {
  it("announces, focuses, and cites a matched result", async () => {
    renderWithRouter(
      <EvidenceAnswer query="medication adherence" synthesis={matched} />,
    );

    const heading = screen.getByRole("heading", {
      name: /evidence for “medication adherence”/i,
    });
    await waitFor(() => expect(heading).toHaveFocus());
    expect(heading.closest("section")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("Synthesis-led")).toBeVisible();
    expect(screen.getByText(/JAMA Psychiatry/)).toBeVisible();
    expect(screen.getByText(/Systematic review/)).toBeVisible();
    const source = screen.getByRole("link", { name: /medication adherence review/i });
    expect(source).toHaveAttribute("target", "_blank");
    expect(source).toHaveAttribute("rel", "noreferrer noopener");
    expect(screen.getByText(/not medical advice/i)).toBeVisible();
  });

  it("offers four existing collections for a no-match result", () => {
    renderWithRouter(
      <EvidenceAnswer
        query="housing policy"
        synthesis={{
          answer: "The current index has no close source match.",
          directMatch: false,
          matches: [],
          signal: "No direct match",
          signalDetail: "Try another research topic.",
        }}
      />,
    );

    expect(screen.getByRole("link", { name: /cure research/i })).toHaveAttribute(
      "href",
      "/category/cure",
    );
    expect(screen.getByRole("link", { name: /^diagnosis$/i })).toHaveAttribute(
      "href",
      "/category/diagnosis",
    );
    expect(screen.getByRole("link", { name: /^treatment$/i })).toHaveAttribute(
      "href",
      "/category/treatment",
    );
    expect(
      screen.getByRole("link", { name: /prevention and early support/i }),
    ).toHaveAttribute("href", "/category/prevention");
    expect(screen.queryByRole("heading", { name: /sources/i })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and observe missing modules**

Run: `pnpm exec vitest run src/components/landing/EvidenceAnswer.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Create the shared topic destinations**

```ts
export interface TopicLink {
  label: string;
  to: `/category/${string}`;
}

export const TOPIC_LINKS: readonly TopicLink[] = [
  { label: "Cure research", to: "/category/cure" },
  { label: "Diagnosis", to: "/category/diagnosis" },
  { label: "Treatment", to: "/category/treatment" },
  {
    label: "Prevention and early support",
    to: "/category/prevention",
  },
];
```

- [ ] **Step 4: Implement the numbered citation list**

```tsx
import { ExternalLink } from "lucide-react";
import { formatPublishedShort } from "@/lib/dates";
import type { EvidenceMatch } from "@/lib/evidenceSearch";

export function EvidenceCitationList({ matches }: { matches: EvidenceMatch[] }) {
  if (matches.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-ink dark:text-ink-inverse">Sources</h3>
      <ol className="mt-3 divide-y divide-line border-y border-line dark:divide-line-dark dark:border-line-dark">
        {matches.map(({ article }, index) => {
          const metadata = [
            article.journal,
            article.studyType,
            formatPublishedShort(article.published),
          ].filter((value): value is string => Boolean(value));

          return (
            <li key={article.id} className="flex gap-3 py-4">
              <span className="text-sm font-semibold tabular-nums text-ink-muted dark:text-ink-muted-dark">
                {index + 1}
              </span>
              <div className="min-w-0">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-start gap-1.5 font-medium text-accent hover:text-accent-hover dark:text-accent-dark dark:hover:text-accent-dark-hover"
                >
                  <span>{article.title}</span>
                  <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </a>
                {metadata.length > 0 && (
                  <p className="mt-1 text-sm text-ink-muted dark:text-ink-muted-dark">
                    {metadata.join(" · ")}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
```

- [ ] **Step 5: Implement the answer region and focus transition**

```tsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { EvidenceCitationList } from "./EvidenceCitationList";
import type { EvidenceSynthesis } from "@/lib/evidenceSearch";
import { TOPIC_LINKS } from "@/lib/topics";

export interface EvidenceAnswerProps {
  query: string;
  synthesis: EvidenceSynthesis;
}

export function EvidenceAnswer({ query, synthesis }: EvidenceAnswerProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [query]);

  return (
    <section
      aria-live="polite"
      aria-atomic="false"
      className="mt-6 rounded-2xl border border-line bg-surface p-5 dark:border-line-dark dark:bg-surface-dark sm:p-7"
    >
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-heading text-2xl font-semibold text-ink outline-none dark:text-ink-inverse"
      >
        Evidence for “{query}”
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-surface-subtle px-2.5 py-1 text-xs font-semibold text-accent dark:bg-surface-dark-subtle dark:text-accent-dark">
          {synthesis.signal}
        </span>
        <span className="text-sm text-ink-muted dark:text-ink-muted-dark">
          {synthesis.signalDetail}
        </span>
      </div>
      <p className="mt-4 leading-7 text-ink dark:text-ink-inverse">
        {synthesis.answer}
      </p>

      {synthesis.directMatch ? (
        <EvidenceCitationList matches={synthesis.matches} />
      ) : (
        <nav aria-label="Browse evidence topics" className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          {TOPIC_LINKS.map((topic) => (
            <Link
              key={topic.to}
              to={topic.to}
              className="text-sm font-semibold text-accent hover:text-accent-hover dark:text-accent-dark dark:hover:text-accent-dark-hover"
            >
              {topic.label}
            </Link>
          ))}
        </nav>
      )}

      <p className="mt-6 border-t border-line pt-4 text-xs leading-5 text-ink-muted dark:border-line-dark dark:text-ink-muted-dark">
        Educational information only. This summary is not medical advice and
        should not replace care from a qualified clinician.
      </p>
    </section>
  );
}
```

- [ ] **Step 6: Run focused and full tests**

Run: `pnpm exec vitest run src/components/landing/EvidenceAnswer.test.tsx`

Run: `npm test`

Expected: PASS.

- [ ] **Step 7: Commit the answer components**

```bash
git add src/lib/topics.ts src/components/landing/EvidenceAnswer.tsx src/components/landing/EvidenceAnswer.test.tsx src/components/landing/EvidenceCitationList.tsx
git commit -m "feat: render source-linked evidence answers"
```

---

## Task 4: Replace the ornamental hero with the search-first composition

**Files:**

- Modify: `src/components/landing/HeroSection.test.tsx`
- Modify: `src/components/landing/HeroSection.tsx`

**Interfaces:**

- New props: `{ categories: ResearchCategory[]; loading?: boolean; error?: string | null }`.
- Removes props: `totalArticles`, `lastUpdated`.
- Owns: the last submitted `{ query, synthesis }` pair. Draft edits remain inside `EvidenceSearchForm` and do not mutate this pair.

- [ ] **Step 1: Replace legacy hero tests with the approved behavior**

Cover the exact headline/trust copy, empty initial state, loading, error, inline submission, focus, retained result while editing, and absence of legacy UI:

```tsx
function renderHero(props: Partial<React.ComponentProps<typeof HeroSection>> = {}) {
  return renderWithRouter(
    <HeroSection categories={categories} loading={false} error={null} {...props} />,
  );
}

it("starts with one evidence-search action and no answer", () => {
  renderHero();
  expect(
    screen.getByRole("heading", { name: /what would you like to understand/i }),
  ).toBeVisible();
  expect(screen.getByText(/independent · source-linked · updated weekly/i)).toBeVisible();
  expect(screen.getByRole("search", { name: /schizopedia evidence search/i })).toBeVisible();
  expect(screen.getByRole("button", { name: /search evidence/i })).toBeDisabled();
  expect(screen.queryByText(/evidence for “/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/studies in the live index/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/one question, every source in view/i)).not.toBeInTheDocument();
});

it("renders a matching inline answer and leaves it visible while editing", async () => {
  const user = userEvent.setup();
  renderHero();
  const field = screen.getByRole("textbox");
  await user.type(field, "medication adherence{Enter}");

  const heading = screen.getByRole("heading", {
    name: /evidence for “medication adherence”/i,
  });
  expect(heading).toHaveFocus();
  expect(screen.getByRole("link", { name: /medication adherence in community care/i })).toHaveAttribute(
    "href",
    "https://pubmed.ncbi.nlm.nih.gov/adherence/",
  );

  await user.clear(field);
  await user.type(field, "family support");
  expect(heading).toBeVisible();
});

it("moves focus after resubmitting the same question", async () => {
  const user = userEvent.setup();
  renderHero();
  const field = screen.getByRole("textbox");
  await user.type(field, "medication adherence{Enter}");
  await user.click(field);
  expect(field).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(
    screen.getByRole("heading", {
      name: /evidence for “medication adherence”/i,
    }),
  ).toHaveFocus();
});

it("disables the form while the index is loading", () => {
  renderHero({ loading: true });
  expect(screen.getByRole("button", { name: /loading index/i })).toBeDisabled();
});

it("keeps browse guidance visible when the feed fails", () => {
  renderHero({ error: "network failed" });
  expect(screen.getByText(/search index unavailable/i)).toBeVisible();
  expect(screen.getByRole("button", { name: /search evidence/i })).toBeDisabled();
  expect(screen.getByText(/browse topics below/i)).toBeVisible();
});
```

- [ ] **Step 2: Run the hero test and observe prop/copy failures**

Run: `pnpm exec vitest run src/components/landing/HeroSection.test.tsx`

Expected: FAIL against the legacy hero.

- [ ] **Step 3: Replace `HeroSection.tsx` with the focused composition**

```tsx
import { useRef, useState } from "react";
import { EvidenceAnswer } from "./EvidenceAnswer";
import { EvidenceSearchForm } from "./EvidenceSearchForm";
import { synthesizeEvidence, type EvidenceSynthesis } from "@/lib/evidenceSearch";
import type { ResearchCategory } from "@/lib/types";

export interface HeroSectionProps {
  categories: ResearchCategory[];
  loading?: boolean;
  error?: string | null;
}

interface SubmittedEvidence {
  id: number;
  query: string;
  synthesis: EvidenceSynthesis;
}

export function HeroSection({
  categories,
  loading = false,
  error = null,
}: HeroSectionProps) {
  const [submitted, setSubmitted] = useState<SubmittedEvidence | null>(null);
  const nextSubmissionId = useRef(0);

  const handleSubmit = (query: string) => {
    nextSubmissionId.current += 1;
    setSubmitted({
      id: nextSubmissionId.current,
      query,
      synthesis: synthesizeEvidence(query, categories),
    });
  };

  return (
    <section id="ask" aria-labelledby="search-heading" className="border-b border-line bg-canvas dark:border-line-dark dark:bg-canvas-dark">
      <div className="container max-w-3xl py-16 sm:py-20 lg:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent dark:text-accent-dark">
            Independent · source-linked · updated weekly
          </p>
          <h1 id="search-heading" className="mt-4 font-heading text-4xl font-semibold leading-tight text-ink dark:text-ink-inverse sm:text-5xl">
            What would you like to understand?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-ink-muted dark:text-ink-muted-dark sm:text-lg">
            Search plain-language summaries of curated schizophrenia research,
            with every result linked back to PubMed.
          </p>
        </div>

        <div className="mt-8">
          <EvidenceSearchForm
            loading={loading}
            disabled={Boolean(error)}
            onSubmit={handleSubmit}
          />
          {error && (
            <p role="status" className="mt-3 text-sm text-ink-muted dark:text-ink-muted-dark">
              <strong className="text-ink dark:text-ink-inverse">Search index unavailable.</strong>{" "}
              Browse topics below while the source data reconnects.
            </p>
          )}
          {submitted && (
            <EvidenceAnswer
              key={submitted.id}
              query={submitted.query}
              synthesis={submitted.synthesis}
            />
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run focused and full tests**

Run: `pnpm exec vitest run src/components/landing/HeroSection.test.tsx src/components/landing/EvidenceSearchForm.test.tsx src/components/landing/EvidenceAnswer.test.tsx`

Run: `npm test`

Expected: PASS.

- [ ] **Step 5: Commit the hero replacement**

```bash
git add src/components/landing/HeroSection.tsx src/components/landing/HeroSection.test.tsx
git commit -m "feat: simplify the evidence search hero"
```

---

## Task 5: Add the compact Browse topics section

**Files:**

- Create: `src/components/landing/BrowseTopics.test.tsx`
- Create: `src/components/landing/BrowseTopics.tsx`

**Interfaces:**

- Consumes: the immutable `TOPIC_LINKS` list.
- Produces: a `#topics` landmark with exactly four internal category links.

- [ ] **Step 1: Write the route contract test**

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrowseTopics } from "./BrowseTopics";
import { renderWithRouter } from "@/test/render";

describe("BrowseTopics", () => {
  it.each([
    ["Cure research", "/category/cure"],
    ["Diagnosis", "/category/diagnosis"],
    ["Treatment", "/category/treatment"],
    ["Prevention and early support", "/category/prevention"],
  ])("links %s to %s", (label, href) => {
    renderWithRouter(<BrowseTopics />);
    expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href);
  });
});
```

- [ ] **Step 2: Run the test and observe the missing component**

Run: `pnpm exec vitest run src/components/landing/BrowseTopics.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Implement the compact text-led grid**

```tsx
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { TOPIC_LINKS } from "@/lib/topics";

export function BrowseTopics() {
  return (
    <section id="topics" aria-labelledby="topics-heading" className="container scroll-mt-24 py-12 lg:py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent dark:text-accent-dark">Browse</p>
          <h2 id="topics-heading" className="mt-1 font-heading text-2xl font-semibold text-ink dark:text-ink-inverse sm:text-3xl">
            Topics
          </h2>
        </div>
        <p className="hidden text-sm text-ink-muted dark:text-ink-muted-dark sm:block">
          Explore the curated evidence collections.
        </p>
      </div>
      <ul className="mt-6 grid overflow-hidden rounded-2xl border border-line bg-surface sm:grid-cols-2 dark:border-line-dark dark:bg-surface-dark">
        {TOPIC_LINKS.map((topic) => (
          <li
            key={topic.to}
            className="border-t border-line first:border-t-0 dark:border-line-dark sm:border-t-0 sm:odd:border-r sm:[&:nth-child(n+3)]:border-t"
          >
            <Link
              to={topic.to}
              className="group flex min-h-16 items-center justify-between gap-3 px-5 py-4 font-medium text-ink transition hover:bg-surface-subtle dark:text-ink-inverse dark:hover:bg-surface-dark-subtle"
            >
              {topic.label}
              <ArrowRight className="h-4 w-4 text-ink-muted transition group-hover:translate-x-0.5 group-hover:text-accent dark:text-ink-muted-dark dark:group-hover:text-accent-dark" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run focused and full tests, then commit**

Run: `pnpm exec vitest run src/components/landing/BrowseTopics.test.tsx`

Run: `npm test`

```bash
git add src/components/landing/BrowseTopics.tsx src/components/landing/BrowseTopics.test.tsx
git commit -m "feat: add compact evidence topic links"
```

---

## Task 6: Turn latest research cards into quiet text rows

**Files:**

- Modify: `src/components/landing/LatestHighlights.test.tsx`
- Modify: `src/components/landing/LatestHighlights.tsx`
- Delete: `src/components/landing/HighlightCard.test.tsx`
- Delete: `src/components/landing/HighlightCard.tsx`

**Interfaces:**

- Consumes: `ResearchCategory[]` and `loading`.
- Produces: exactly the three newest cross-category studies, ordered by `publishedTimestamp`, with category/date/title/excerpt/PubMed link.

- [ ] **Step 1: Replace card-specific tests with row behavior**

Keep the existing date and recency tests, then add safe-link and no-gradient assertions:

```tsx
it("renders source-linked text rows without decorative image headers", () => {
  const { container } = renderWithRouter(
    <LatestHighlights categories={categories} loading={false} />,
  );

  const link = screen.getByRole("link", { name: "Newest diagnosis article" });
  expect(link).toHaveAttribute("href", "https://pubmed.ncbi.nlm.nih.gov/2/");
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noreferrer noopener");
  expect(container.querySelector('[class*="highlight-gradient"]')).toBeNull();
});

it("renders three low-contrast text-row skeletons while loading", () => {
  const { container } = renderWithRouter(
    <LatestHighlights categories={[]} loading />,
  );
  expect(screen.getByText(/loading latest studies/i)).toBeInTheDocument();
  expect(container.querySelectorAll(".animate-pulse")).toHaveLength(3);
});
```

- [ ] **Step 2: Run the focused test and observe the old link/gradient contract fail**

Run: `pnpm exec vitest run src/components/landing/LatestHighlights.test.tsx`

Expected: FAIL because the old card exposes a “Read summary” link and decorative header.

- [ ] **Step 3: Replace `LatestHighlights` with row rendering**

Replace the file imports and public interface with:

```tsx
import { formatPublishedShort, publishedTimestamp } from "@/lib/dates";
import type { ResearchCategory } from "@/lib/types";

export { formatPublishedShort };

export interface LatestHighlightsProps {
  categories: ResearchCategory[];
  loading: boolean;
}
```

Remove all variant/icon/link imports and render this structure:

```tsx
export function LatestHighlights({ categories, loading }: LatestHighlightsProps) {
  const picks = pickHighlights(categories, 3);

  return (
    <section id="latest" aria-labelledby="latest-heading" className="container py-12 lg:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent dark:text-accent-dark">Updated weekly</p>
      <h2 id="latest-heading" className="mt-1 font-heading text-2xl font-semibold text-ink dark:text-ink-inverse sm:text-3xl">
        Latest studies
      </h2>

      {loading && picks.length === 0 ? (
        <div aria-busy="true" aria-live="polite">
          <span className="sr-only">Loading latest studies…</span>
          <ul className="mt-5 divide-y divide-line border-y border-line dark:divide-line-dark dark:border-line-dark">
            {Array.from({ length: 3 }, (_, index) => (
              <li key={index} aria-hidden="true" className="animate-pulse py-5">
                <div className="h-3 w-36 rounded bg-surface-subtle dark:bg-surface-dark-subtle" />
                <div className="mt-3 h-5 w-3/4 rounded bg-surface-subtle dark:bg-surface-dark-subtle" />
                <div className="mt-3 h-3 w-full rounded bg-surface-subtle dark:bg-surface-dark-subtle" />
              </li>
            ))}
          </ul>
        </div>
      ) : picks.length === 0 ? (
        <p className="mt-5 border-y border-line py-5 text-sm text-ink-muted dark:border-line-dark dark:text-ink-muted-dark">
          No studies are available yet. Check back after the next weekly refresh.
        </p>
      ) : (
        <ol className="mt-5 divide-y divide-line border-y border-line dark:divide-line-dark dark:border-line-dark">
          {picks.map(({ article, category, dateLabel }) => (
            <li key={article.id} className="py-5">
              <article>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted dark:text-ink-muted-dark">
                  {category.title} · {dateLabel}
                </p>
                <h3 className="mt-2 font-heading text-xl font-semibold text-ink dark:text-ink-inverse">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-accent dark:hover:text-accent-dark"
                  >
                    {article.title}
                  </a>
                </h3>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-ink-muted dark:text-ink-muted-dark">
                  {truncate(article.snippet ?? "Open the PubMed record for study details.", 220)}
                </p>
              </article>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max).trimEnd()}…` : value;
}

interface Pick {
  article: ResearchCategory["articles"][number];
  category: { id: string; title: string };
  dateLabel: string;
  sortKey: number;
}

function pickHighlights(categories: ResearchCategory[], count: number): Pick[] {
  const all = categories.flatMap((category) =>
    (category.articles ?? []).map((article) => ({
      article,
      category: { id: category.id, title: category.title },
      dateLabel: formatPublishedShort(article.published) ?? "Recent",
      sortKey: publishedTimestamp(article.published),
    })),
  );

  return all.sort((a, b) => b.sortKey - a.sortKey).slice(0, count);
}
```

- [ ] **Step 4: Confirm `HighlightCard` has no remaining consumer**

Run: `rg -n "HighlightCard|highlight-gradient" src --glob '!src/components/landing/HighlightCard*'`

Expected: no `HighlightCard` imports and no active highlight-gradient class.

- [ ] **Step 5: Delete the obsolete card and its test, then verify**

Delete both named files with `apply_patch`.

Run: `pnpm exec vitest run src/components/landing/LatestHighlights.test.tsx`

Run: `npm test`

Expected: PASS.

- [ ] **Step 6: Commit the latest-studies simplification**

```bash
git add src/components/landing/LatestHighlights.tsx src/components/landing/LatestHighlights.test.tsx src/components/landing/HighlightCard.tsx src/components/landing/HighlightCard.test.tsx
git commit -m "feat: simplify latest research highlights"
```

---

## Task 7: Reduce the landing page to the four approved regions

**Files:**

- Modify: `src/pages/LandingPage.test.tsx`
- Modify: `src/pages/LandingPage.tsx`

**Interfaces:**

- Consumes: `{ data, loading, error }` from `useResearchData()`.
- Produces: header (through `PageShell`), search hero, Browse topics, Latest studies, and footer only.
- Invariant: landing search uses `data?.categories ?? []`; it does not silently search fallback content during a feed error.

- [ ] **Step 1: Rewrite the page-level composition test**

Change the Testing Library import to include `within`:

```ts
import { screen, waitFor, within } from "@testing-library/react";
```

```tsx
it("renders search, four topics, latest studies, and footer only", async () => {
  renderPage();

  expect(
    screen.getByRole("heading", { level: 1, name: /what would you like to understand/i }),
  ).toBeVisible();
  expect(screen.getByRole("heading", { level: 2, name: /^topics$/i })).toBeVisible();
  const topics = within(screen.getByRole("region", { name: /^topics$/i }));
  expect(topics.getAllByRole("link")).toHaveLength(4);

  await waitFor(() => expect(screen.getByText("Recent treatment advance")).toBeVisible());
  expect(screen.getByText("Recent diagnosis advance")).toBeVisible();
  expect(screen.getByText(/knowledge today\. better tomorrows\./i)).toBeVisible();

  expect(screen.queryByText(/one question, every source in view/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/new to all of this/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/making research accessible/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/around the world/i)).not.toBeInTheDocument();
});

it("keeps topics usable when the research feed fails", async () => {
  vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("offline"));
  renderPage();

  expect(await screen.findByText(/search index unavailable/i)).toBeVisible();
  expect(screen.getByRole("button", { name: /search evidence/i })).toBeDisabled();
  expect(screen.getByRole("link", { name: /cure research/i })).toBeVisible();
  expect(screen.getByText(/no studies are available yet/i)).toBeVisible();
});
```

Set and restore the embedded-data global explicitly so every test exercises the mocked fetch:

```ts
beforeEach(() => {
  globalThis.__RESEARCH__ = null;
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(payload),
  } as Response);
});

afterEach(() => {
  globalThis.__RESEARCH__ = undefined;
  vi.restoreAllMocks();
});
```

- [ ] **Step 2: Run the page test and observe legacy-section failures**

Run: `pnpm exec vitest run src/pages/LandingPage.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Replace the page composition with only approved components**

```tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BrowseTopics } from "@/components/landing/BrowseTopics";
import { HeroSection } from "@/components/landing/HeroSection";
import { LatestHighlights } from "@/components/landing/LatestHighlights";
import { PageShell } from "@/components/layout/PageLayout";
import { useResearchData } from "@/hooks/useResearchData";

export function LandingPage() {
  const { data, loading, error } = useResearchData();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    document.querySelector(hash)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [hash, loading]);

  const categories = data?.categories ?? [];

  return (
    <PageShell mainId="top">
      <HeroSection categories={categories} loading={loading} error={error} />
      <BrowseTopics />
      <LatestHighlights categories={categories} loading={loading} />
    </PageShell>
  );
}
```

- [ ] **Step 4: Run focused and full tests**

Run: `pnpm exec vitest run src/pages/LandingPage.test.tsx`

Run: `npm test`

Expected: PASS.

- [ ] **Step 5: Commit the reduced page**

```bash
git add src/pages/LandingPage.tsx src/pages/LandingPage.test.tsx
git commit -m "feat: reduce the landing page to essentials"
```

---

## Task 8: Simplify global navigation and footer destinations

**Files:**

- Modify: `src/components/landing/SiteNav.test.tsx`
- Modify: `src/components/landing/SiteNav.tsx`
- Modify: `src/components/landing/SiteFooter.test.tsx`
- Modify: `src/components/landing/SiteFooter.tsx`

**Interfaces:**

- Header destinations: home wordmark, Browse `/#topics`, Guides `/guide/what-is-schizophrenia`, Support `/donate`, and the persisted theme control.
- Footer destinations: Guides, Prevalence, Donate, Privacy, Terms.
- Mobile menu mirrors the two navigation destinations and theme control.

- [ ] **Step 1: Update tests to the minimal navigation contract**

Replace the legacy assertions with:

```tsx
expect(screen.getByRole("link", { name: "Browse" })).toHaveAttribute("href", "/#topics");
expect(screen.getByRole("link", { name: "Guides" })).toHaveAttribute(
  "href",
  "/guide/what-is-schizophrenia",
);
expect(screen.getByRole("link", { name: /^support$/i })).toHaveAttribute("href", "/donate");
expect(screen.queryByRole("link", { name: /ask ai|evidence|research/i })).not.toBeInTheDocument();
```

In the mobile-menu tests, query `Browse` and `Guides` instead of `Ask AI`, `Evidence`, and `Research`. For the footer, assert:

```tsx
expect(screen.getByRole("link", { name: /^guides$/i })).toHaveAttribute(
  "href",
  "/guide/what-is-schizophrenia",
);
expect(screen.getByRole("link", { name: /^prevalence$/i })).toHaveAttribute(
  "href",
  "/prevalence",
);
expect(screen.getByRole("link", { name: /^donate$/i })).toHaveAttribute("href", "/donate");
expect(screen.getByRole("link", { name: /^privacy$/i })).toHaveAttribute("href", "/privacy");
expect(screen.getByRole("link", { name: /^terms$/i })).toHaveAttribute("href", "/terms");
expect(screen.getByText(/educational information, not medical advice/i)).toBeVisible();
```

- [ ] **Step 2: Run chrome tests and observe legacy-label failures**

Run: `pnpm exec vitest run src/components/landing/SiteNav.test.tsx src/components/landing/SiteFooter.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Update navigation data and simplify the control styling**

Use exactly these items and remove the `Heart` import/icon:

```ts
const navItems = [
  { label: "Browse", to: "/#topics" },
  { label: "Guides", to: "/guide/what-is-schizophrenia" },
];

const navLinkClass =
  "text-sm font-medium text-ink-muted transition hover:text-accent dark:text-ink-muted-dark dark:hover:text-accent-dark";
```

Use semantic surfaces for both desktop and mobile header:

```tsx
<header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur dark:border-line-dark dark:bg-surface-dark/95">
```

The support link copy is always `Support` and uses this exact class:

```tsx
className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:bg-accent-dark dark:text-canvas-dark dark:hover:bg-accent-dark-hover dark:focus-visible:ring-accent-dark"
```

Keep the mobile toggle contract in this exact shape, with the existing `Menu`/`X` icon conditional inside the button:

```tsx
<button
  type="button"
  onClick={() => setMenuOpen((open) => !open)}
  aria-label={menuOpen ? "Close menu" : "Open menu"}
  aria-expanded={menuOpen}
  className="inline-flex items-center justify-center rounded-xl border border-line bg-surface p-2 text-ink-muted transition hover:bg-surface-subtle dark:border-line-dark dark:bg-surface-dark dark:text-ink-muted-dark dark:hover:bg-surface-dark-subtle md:hidden"
>
  {menuOpen ? (
    <X className="h-5 w-5" aria-hidden="true" />
  ) : (
    <Menu className="h-5 w-5" aria-hidden="true" />
  )}
</button>
```

Desktop keeps `<ThemeToggle className="hidden md:inline-flex" />`; mobile keeps `<ThemeToggle />` in the open `aria-label="Mobile"` navigation. Every mobile `Link` calls `setMenuOpen(false)`.

- [ ] **Step 4: Render the exact footer link set**

```tsx
const footerLinks = [
  { label: "Guides", to: "/guide/what-is-schizophrenia" },
  { label: "Prevalence", to: "/prevalence" },
  { label: "Donate", to: DONATE_PATH },
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface dark:border-line-dark dark:bg-surface-dark">
      <div className="container flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-xl font-semibold text-ink dark:text-ink-inverse">Schizopedia</p>
          <p className="mt-1 text-sm text-ink-muted dark:text-ink-muted-dark">Knowledge today. Better tomorrows.</p>
          <p className="mt-1 text-xs text-ink-muted dark:text-ink-muted-dark">Educational information, not medical advice.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted dark:text-ink-muted-dark">
          {footerLinks.map((link) => (
            <Link key={link.to} to={link.to} className="transition hover:text-accent dark:hover:text-accent-dark">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Run focused and full tests, then commit**

Run: `pnpm exec vitest run src/components/landing/SiteNav.test.tsx src/components/landing/SiteFooter.test.tsx`

Run: `npm test`

```bash
git add src/components/landing/SiteNav.tsx src/components/landing/SiteNav.test.tsx src/components/landing/SiteFooter.tsx src/components/landing/SiteFooter.test.tsx
git commit -m "feat: simplify global navigation"
```

---

## Task 9: Establish the clinical light/dark token foundation

**Files:**

- Create: `src/components/layout/PageLayout.test.tsx`
- Modify: `tailwind.config.js`
- Modify: `src/index.css`
- Modify: `src/components/layout/PageLayout.tsx`
- Modify: `src/components/ui/card.tsx`
- Modify: `src/lib/styles.ts`

**Interfaces:**

- Semantic Tailwind colors expose exact approved light/dark values.
- `PageShell` supplies the canvas; `PageHero` supplies a flat secondary surface.
- `Card` supplies the shared primary surface, moderate radius, and thin border.

- [ ] **Step 1: Add a failing shared-shell test**

```tsx
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHero, PageShell } from "./PageLayout";
import { renderWithProviders } from "@/test/render";

describe("PageLayout", () => {
  it("uses the semantic canvas and flat hero surface", () => {
    const { container } = renderWithProviders(
      <PageShell><PageHero title="Test page" /></PageShell>,
    );
    expect(container.firstElementChild).toHaveClass("bg-canvas", "dark:bg-canvas-dark");
    expect(screen.getByRole("heading", { name: "Test page" }).closest("section")).toHaveClass("hero-band");
  });
});
```

- [ ] **Step 2: Run the test and observe the old canvas-class failure**

Run: `pnpm exec vitest run src/components/layout/PageLayout.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Add exact semantic colors to Tailwind**

Keep the existing font families and replace/extend the color block with:

```js
colors: {
  canvas: { DEFAULT: "#f7f9fc", dark: "#0d1522" },
  surface: {
    DEFAULT: "#ffffff",
    subtle: "#f1f5f9",
    dark: "#141f30",
    "dark-subtle": "#192638",
  },
  ink: {
    DEFAULT: "#162033",
    inverse: "#eef4fb",
    muted: "#5f6b7a",
    "muted-dark": "#a5b2c2",
  },
  line: { DEFAULT: "#dce3ec", dark: "#2a3a4f" },
  accent: {
    DEFAULT: "#2563eb",
    hover: "#1d4ed8",
    dark: "#78a9ff",
    "dark-hover": "#9bbfff",
  },
  brand: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
},
```

Replace the elevated card shadows with one restrained value:

```js
boxShadow: {
  card: "0 1px 2px rgba(15, 23, 42, 0.04)",
},
```

- [ ] **Step 4: Collapse `index.css` to active global styles**

Remove all legacy `.evidence-*`, `.ask-*`, `.question-chip`, `.answer-panel`, `.network-*`, `.source-rail-*`, `.brain-glow`, `.highlight-gradient-*`, and `.fade-up` rules. Keep only Tailwind directives, color-scheme/body/root rules, the small wordmark glyph, flat hero band, focus, and reduced-motion behavior:

```css
/* Fonts are loaded via <link> in index.html (non-render-blocking). */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }
.dark { color-scheme: dark; }

body {
  @apply min-h-screen bg-canvas text-ink antialiased;
}

.dark body {
  @apply bg-canvas-dark text-ink-inverse;
}

#root { min-height: 100vh; }

::selection {
  background: rgba(37, 99, 235, 0.22);
  color: #162033;
}

.dark ::selection {
  background: rgba(120, 169, 255, 0.3);
  color: #eef4fb;
}

.brand-glyph {
  position: relative;
  display: inline-flex;
  width: 1.75rem;
  height: 1.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.55rem;
  background: #2563eb;
}

.brand-glyph span {
  position: absolute;
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 0 0 2px #2563eb;
}

.brand-glyph span:nth-child(1) { transform: translate(-0.34rem, 0.2rem); }
.brand-glyph span:nth-child(2) { transform: translate(0.34rem, 0.2rem); }
.brand-glyph span:nth-child(3) { transform: translateY(-0.34rem); }

.hero-band {
  border-bottom: 1px solid #dce3ec;
  background: #f1f5f9;
}

.dark .hero-band {
  border-bottom-color: #2a3a4f;
  background: #192638;
}

:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 3px;
  border-radius: 4px;
}

.dark :focus-visible { outline-color: #78a9ff; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Apply semantic classes to shared primitives**

Use these exact base strings:

```tsx
// PageShell
"flex min-h-screen flex-col bg-canvas text-ink dark:bg-canvas-dark dark:text-ink-inverse"

// Card
"rounded-2xl border border-line bg-surface text-ink shadow-card dark:border-line-dark dark:bg-surface-dark dark:text-ink-inverse"

// CardHeader divider
"flex flex-col gap-1.5 border-b border-line pb-4 dark:border-line-dark"
```

Change PageHero title, description, and meta from `slate-*` to `ink`, `ink-muted`, `ink-inverse`, and `ink-muted-dark`. Change `TEXT_ACTION_LINK_CLASS` to:

```ts
export const TEXT_ACTION_LINK_CLASS =
  "inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:text-accent-hover dark:text-accent-dark dark:hover:text-accent-dark-hover";
```

- [ ] **Step 6: Run focused, full, and build checks**

Run: `pnpm exec vitest run src/components/layout/PageLayout.test.tsx`

Run: `npm test`

Run: `pnpm run build`

Expected: PASS, including Tailwind compilation and prerendering.

- [ ] **Step 7: Commit the token foundation**

```bash
git add tailwind.config.js src/index.css src/components/layout/PageLayout.tsx src/components/layout/PageLayout.test.tsx src/components/ui/card.tsx src/lib/styles.ts
git commit -m "style: introduce clinical light and dark tokens"
```

---

## Task 10: Align all active secondary routes with the shared visual system

**Files:**

- Modify: `src/pages/GuidePage.test.tsx`
- Modify: `src/pages/GuidePage.tsx`
- Modify: `src/pages/CategoryPage.tsx`
- Modify: `src/pages/DonatePage.tsx`
- Modify: `src/components/legal/LegalLayout.tsx`
- Modify: `src/components/prevalence/WorldPrevalence.tsx`
- Modify: `src/components/research/ArticleCard.tsx`
- Modify: `src/components/research/EvidenceLegend.tsx`
- Modify: `src/components/research/ResearchSection.tsx`
- Modify: `src/components/research/SafetyPanel.tsx`
- Modify: `src/components/research/SkeletonList.tsx`
- Modify: `src/components/research/SourcesPanel.tsx`
- Modify: `src/components/research/StateOfField.tsx`

**Interfaces:**

- Route content and data behavior remain unchanged.
- Guide hero back-link changes from the removed `/#start-here` anchor to `/` with label `Back home`.
- Active surfaces use semantic tokens, thin borders, `rounded-xl`/`rounded-2xl`, and no ornamental gradients.

- [ ] **Step 1: Add the guide back-link regression test**

```tsx
it("returns to the homepage now that the landing guide rail is removed", () => {
  renderAt("/guide/what-is-schizophrenia");
  expect(screen.getByRole("link", { name: /back home/i })).toHaveAttribute(
    "href",
    "/",
  );
});
```

- [ ] **Step 2: Run the guide test and observe the old anchor failure**

Run: `pnpm exec vitest run src/pages/GuidePage.test.tsx`

Expected: FAIL because the link still targets `/#start-here`.

- [ ] **Step 3: Fix the removed-anchor destination**

Replace the existing guide `PageHero` invocation with:

```tsx
<PageHero
  backLabel="Back home"
  backTo="/"
  title={guide.title}
  titleClassName="max-w-3xl"
  description={guide.description}
  meta={
    <>
      <Clock className="h-4 w-4" aria-hidden="true" />
      {guide.readingMinutes} min read
    </>
  }
  metaClassName="inline-flex items-center gap-1.5"
/>
```

- [ ] **Step 4: Restyle guide and legal reading surfaces**

In `GuidePage.tsx` and `LegalLayout.tsx`, apply the semantic mapping below to the disclaimer, article copy, section headings, dividers, and guide navigation. Preserve amber warning callouts; change only neutral surfaces and brand links.

- [ ] **Step 5: Restyle the category research panels**

Apply the mapping to `ArticleCard`, `EvidenceLegend`, `ResearchSection`, `SafetyPanel`, `SkeletonList`, `SourcesPanel`, and `StateOfField`. Preserve evidence badges and safety colors. For research-section icons, use:

```tsx
<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-subtle text-accent dark:bg-surface-dark-subtle dark:text-accent-dark">
  <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
</span>
```

- [ ] **Step 6: Restyle donation, prevalence, and category-page status surfaces**

Apply the same mapping to the neutral panels in `DonatePage.tsx`, `WorldPrevalence.tsx`, and the neutral scaffolding in `CategoryPage.tsx`. Keep the category feed error banner red because it communicates failure.

Use this mapping in Steps 4–6:

| Legacy class role | Required semantic class |
|---|---|
| `border-slate-200`, `dark:border-white/10` | `border-line dark:border-line-dark` |
| `bg-white`, `dark:bg-[#0f172a]` | `bg-surface dark:bg-surface-dark` |
| `bg-slate-50`, `dark:bg-white/5` | `bg-surface-subtle dark:bg-surface-dark-subtle` |
| `text-slate-900`, `dark:text-white` | `text-ink dark:text-ink-inverse` |
| `text-slate-500/600/700`, `dark:text-slate-300/400` | `text-ink-muted dark:text-ink-muted-dark` for supporting copy |
| `text-brand-700`, `dark:text-brand-300` links | `text-accent dark:text-accent-dark` |
| `hover:text-brand-800`, `dark:hover:text-brand-200` | `hover:text-accent-hover dark:hover:text-accent-dark-hover` |
| `rounded-3xl` primary panels | `rounded-2xl` |

Use these exact wrapper classes for the main neutral surfaces:

```tsx
// Guide disclaimer
"rounded-xl border border-line bg-surface-subtle px-5 py-4 text-sm text-ink-muted dark:border-line-dark dark:bg-surface-dark-subtle dark:text-ink-muted-dark"

// ArticleCard <li>
"group rounded-xl border border-line bg-surface p-4 text-ink-muted transition hover:border-accent/40 dark:border-line-dark dark:bg-surface-dark dark:text-ink-muted-dark dark:hover:border-accent-dark/50"

// EvidenceLegend <section>
"rounded-2xl border border-line bg-surface-subtle p-5 dark:border-line-dark dark:bg-surface-dark-subtle"

// StateOfField <section>
"rounded-2xl border border-line bg-surface p-6 dark:border-line-dark dark:bg-surface-dark sm:p-8"

// ResearchSection empty state and SkeletonList rows
"rounded-xl border border-line bg-surface-subtle px-6 py-4 text-sm text-ink-muted dark:border-line-dark dark:bg-surface-dark-subtle dark:text-ink-muted-dark"

// Donate primary panel / prevalence GlobalStat
"rounded-2xl border border-line bg-surface p-6 dark:border-line-dark dark:bg-surface-dark"

// Donate support point / SourcesPanel source row
"rounded-xl border border-line bg-surface-subtle p-5 dark:border-line-dark dark:bg-surface-dark-subtle"
```

`SafetyPanel` keeps only `className="border-blue-200 dark:border-blue-300/30"` on the shared `Card`. `SourcesPanel` uses `<Card id="sources">` with no visual override. Preserve safety-specific amber/red/blue status colors where color communicates meaning. Remove `glow-card`, raw dark hex colors, `tint-sky`, and oversized shadows from the active files.

- [ ] **Step 7: Verify no active route retains the obsolete surface literals**

Run:

```bash
rg -n "bg-\[#0f172a\]|bg-\[#0b1220\]|rounded-3xl|glow-card|tint-sky" src/pages src/components/layout src/components/legal src/components/prevalence src/components/research
```

Expected: no matches in active route/surface files. If an intentionally status-colored match remains, document it in the commit body rather than applying an unsafe blind replacement.

- [ ] **Step 8: Run route/component regressions**

Run: `pnpm exec vitest run src/pages/CategoryPage.test.tsx src/pages/GuidePage.test.tsx src/pages/DonatePage.test.tsx src/pages/PrevalencePage.test.tsx src/components/research src/components/prevalence`

Run: `npm test`

Run: `pnpm run build`

Expected: PASS.

- [ ] **Step 9: Commit the route-level restyle**

```bash
git add src/pages/GuidePage.tsx src/pages/GuidePage.test.tsx src/pages/CategoryPage.tsx src/pages/DonatePage.tsx src/components/legal/LegalLayout.tsx src/components/prevalence/WorldPrevalence.tsx src/components/research/ArticleCard.tsx src/components/research/EvidenceLegend.tsx src/components/research/ResearchSection.tsx src/components/research/SafetyPanel.tsx src/components/research/SkeletonList.tsx src/components/research/SourcesPanel.tsx src/components/research/StateOfField.tsx
git commit -m "style: align content routes with clinical theme"
```

---

## Task 11: Remove verified-obsolete brain code and homepage preload

**Files:**

- Delete: `src/components/landing/BrainScene.tsx`
- Delete: `src/components/landing/BrainIllustration.tsx`
- Delete: `src/components/landing/BrainIllustration.test.tsx`
- Delete: `public/brain-aerial.svg`
- Delete: `public/hero-brain.jpg`
- Delete: `public/hero-brain.webp`
- Modify: `scripts/prerender.mjs`

**Interfaces:**

- Prerender output retains fonts, SEO head, inline research payload, and every route.
- It no longer emits a preload for an image absent from the homepage.

- [ ] **Step 1: Prove all remaining brain references are confined to deletion targets/preload**

Run:

```bash
rg -n "BrainScene|BrainIllustration|brain-aerial|hero-brain" src public index.html scripts
```

Expected: only the three components/tests, three assets, and `scripts/prerender.mjs` preload block.

- [ ] **Step 2: Remove the obsolete homepage preload**

Delete this entire conditional from `scripts/prerender.mjs`:

```js
if (route.path === "/") {
  parts.push(
    `<link rel="preload" as="image" href="/brain-aerial.svg" type="image/svg+xml" fetchpriority="high" />`,
  );
}
```

- [ ] **Step 3: Delete the verified-unused files**

Use `apply_patch` for the text components/tests. Remove the three binary/image assets only after Step 1 confirms the exact paths.

- [ ] **Step 4: Prove no brain reference remains**

Run:

```bash
rg -n "BrainScene|BrainIllustration|brain-aerial|hero-brain|brain-glow" src public index.html scripts
```

Expected: no matches.

- [ ] **Step 5: Run required verification and commit**

Run: `npm test`

Run: `pnpm run build`

Expected: PASS and prerendered home HTML contains no brain preload.

```bash
git add scripts/prerender.mjs src/components/landing/BrainScene.tsx src/components/landing/BrainIllustration.tsx src/components/landing/BrainIllustration.test.tsx public/brain-aerial.svg public/hero-brain.jpg public/hero-brain.webp
git commit -m "chore: remove obsolete brain landing assets"
```

---

## Task 12: Update search metadata, living documentation, and two-theme visual checks

**Files:**

- Modify: `src/lib/seo.test.ts`
- Modify: `src/lib/seo.ts`
- Modify: `scripts/visualCheck.mjs`
- Modify: `features.md`
- Modify: `CLAUDE.md`

**Interfaces:**

- Homepage metadata describes deterministic evidence search without calling it AI.
- Visual checks cover the landing, category, guide, prevalence, donation, privacy, and terms experiences at desktop/mobile in both persisted themes.
- Living product/architecture docs describe the shipped page, not removed components.

- [ ] **Step 1: Add a metadata regression test**

```ts
it("describes the homepage as source-linked evidence search without an AI claim", () => {
  const meta = resolveSeo("/");
  expect(meta.title).toMatch(/evidence search/i);
  expect(meta.title).not.toMatch(/\bAI\b/i);
  expect(meta.description).toMatch(/source-linked/i);
});
```

- [ ] **Step 2: Run the SEO test and observe the `AI` title failure**

Run: `pnpm exec vitest run src/lib/seo.test.ts`

Expected: FAIL.

- [ ] **Step 3: Update homepage metadata**

```ts
const HOME_TITLE =
  "Schizopedia — Evidence Search & Schizophrenia Research";
const HOME_DESCRIPTION =
  "Search cautious, source-linked summaries of curated schizophrenia research and explore weekly-updated PubMed studies and plain-language guides.";
```

- [ ] **Step 4: Make the visual harness validate both persisted themes**

Add the missing route representatives and theme list:

```js
const ROUTES = [
  { id: "landing", path: "/" },
  { id: "category-treatment", path: "/category/treatment" },
  { id: "guide-warning-signs", path: "/guide/early-warning-signs" },
  { id: "prevalence", path: "/prevalence" },
  { id: "donate", path: "/donate" },
  { id: "privacy", path: "/privacy" },
  { id: "terms", path: "/terms" },
];

const THEMES = ["light", "dark"];
```

In `checkNav`, query the new mobile destination:

```js
const firstLink = page
  .getByRole("navigation", { name: "Mobile" })
  .getByRole("link", { name: "Browse" });
```

Replace the context/route portion of `main()` with this complete loop:

```js
for (const theme of THEMES) {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      colorScheme: theme,
    });
    await context.addInitScript(
      ({ selectedTheme }) => {
        localStorage.setItem("schizopedia-theme", selectedTheme);
      },
      { selectedTheme: theme },
    );

    const page = await context.newPage();

    for (const route of ROUTES) {
      const url = `${BASE_URL}${route.path}`;
      await page.goto(url, { waitUntil: "networkidle" });

      const overflow = await findOverflowingElements(page);
      if (overflow.scrollWidth > overflow.viewportWidth + 1) {
        failures.push(
          `[${theme}/${viewport.id}] ${route.path} overflows horizontally ` +
            `(${overflow.scrollWidth}px content in ${overflow.viewportWidth}px viewport). ` +
            `Widest offenders: ${overflow.offenders
              .map((offender) =>
                `<${offender.tag} class="${offender.class}"> right=${offender.right}`,
              )
              .join(" | ")}`,
        );
      }

      if (route.id === "landing") {
        const navProblem = await checkNav(page, viewport);
        if (navProblem) {
          failures.push(`[${theme}/${viewport.id}] ${navProblem}`);
        }
      }

      await page.screenshot({
        path: path.join(
          OUT_DIR,
          `${route.id}-${theme}-${viewport.id}.png`,
        ),
        fullPage: true,
      });
    }

    await context.close();
  }
}
```

Replace the success message with:

```js
console.log(
  `Visual check passed: ${ROUTES.length} routes × ${VIEWPORTS.length} viewports × ${THEMES.length} themes, no overflow, nav OK ✅`,
);
```

- [ ] **Step 5: Rewrite stale product scenarios**

In `features.md`, replace the old Landing page scenarios with completed scenarios for:

```gherkin
Scenario: Search-first evidence hero
  Given a visitor lands on /
  When the page renders
  Then the only primary action is a labeled evidence question field and disabled "Search evidence" button
  And no answer, brain artwork, evidence network, stats, source rail, or suggestion chips render before submission
  And the status is "completed"

Scenario: Deterministic inline evidence results
  Given the curated PubMed index has loaded
  When a visitor submits a relevant plain-language question
  Then a cautious stored-field summary and at most three numbered PubMed citations expand below the form
  And weak or absent matches show an honest no-match state with four topic links
  And the question never leaves or persists on the device
  And the status is "completed"

Scenario: Compact topic and latest-study sections
  Given a visitor browses below the search
  When the page renders
  Then four compact category links and the three newest source-linked studies appear before the footer
  And no start-here, prevalence teaser, or about section appears on the homepage
  And the status is "completed"
```

Update the Site chrome scenario to Browse/Guides/Support, the prevalence scenario to say it is linked from the footer (not a landing teaser), and the resilience scenario to distinguish category-page fallbacks from landing search unavailability. Remove the now-completed “Search across articles” and obsolete “Real imagery on highlight cards” planned scenarios.

- [ ] **Step 6: Update the architecture map**

In `CLAUDE.md`, replace the active landing entries with:

```text
pages/
  LandingPage.tsx                  # / — search + topics + latest studies
components/landing/
  HeroSection.tsx                 # Search hero and last submitted result state
  EvidenceSearchForm.tsx          # Accessible local question form
  EvidenceAnswer.tsx              # Focused inline summary/no-match state
  EvidenceCitationList.tsx        # Numbered PubMed sources
  BrowseTopics.tsx                # Four compact category routes
  LatestHighlights.tsx            # Three newest studies as text rows
  SiteNav.tsx                     # Minimal nav + theme toggle
  SiteFooter.tsx                  # Education framing + compact route links
lib/
  evidenceSearch.ts               # Deterministic local scoring and summary
  topics.ts                       # Shared category destinations
```

Replace the landing data-flow bullets with:

```text
3. LandingPage passes the loaded categories and feed state to HeroSection and LatestHighlights; a failed feed disables search while static topic routes remain usable.
4. HeroSection submits trimmed questions to synthesizeEvidence() entirely in memory and renders EvidenceAnswer inline; questions are not sent or persisted.
5. LatestHighlights selects the three newest articles across loaded categories; category pages retain their existing fallback-data behavior.
```

Remove Brain/CategoryIconCard/About/HighlightCard claims from the active landing architecture. Do not alter command or curation guidance.

- [ ] **Step 7: Run focused and repository verification**

Run: `pnpm exec vitest run src/lib/seo.test.ts`

Run: `npm test`

Run: `pnpm run build`

Expected: PASS.

- [ ] **Step 8: Commit metadata, docs, and harness**

```bash
git add src/lib/seo.ts src/lib/seo.test.ts scripts/visualCheck.mjs features.md CLAUDE.md
git commit -m "docs: align search experience and visual checks"
```

---

## Task 13: Run final functional, responsive, dark-mode, and cleanup verification

**Files:**

- Verify only; modify the owning task’s files if a failure is discovered.
- Generated and ignored: `dist/`, `dist-ssr/`, `screenshots/`.

**Interfaces:**

- Produces fresh evidence that tests, build, prerender, responsive layout, mobile navigation, and both themes work.
- Leaves a clean tracked worktree except the user-owned `.superpowers/` directory.

- [ ] **Step 1: Invoke the completion-verification discipline**

Read and apply `superpowers:verification-before-completion` before making any success claim.

- [ ] **Step 2: Run static cleanup guards**

Run:

```bash
rg -n "Ask AI|one question, every source in view|EvidenceSourceRail|WorldPrevalenceTeaser|BrainScene|BrainIllustration|brain-aerial|hero-brain|highlight-gradient|network-panel" src public scripts features.md CLAUDE.md
```

Expected: no active implementation/documentation matches. If the phrase appears in a deliberate negative test assertion, inspect it and keep only when it verifies removal.

Run: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 3: Run the full automated suite from a fresh command**

Run: `npm test`

Expected: data validation and all Vitest files PASS with zero failures.

- [ ] **Step 4: Build and prerender every route**

Run: `pnpm run build`

Expected: client build, SSR build, prerender, sitemap, and Sites preparation all exit 0.

- [ ] **Step 5: Start the local app for visual verification**

In a persistent terminal, run:

```bash
pnpm dev --host 127.0.0.1 --port 5173
```

Wait for Vite to report the local URL. Keep this process running only for the next step.

- [ ] **Step 6: Run responsive checks in both themes**

In a second terminal, run:

```bash
pnpm run visual:check -- http://127.0.0.1:5173
```

Expected: all configured routes pass desktop/mobile overflow and navigation checks in light and dark themes. Inspect at minimum these generated images with `view_image`:

- `screenshots/landing-light-desktop.png`
- `screenshots/landing-light-mobile.png`
- `screenshots/landing-dark-desktop.png`
- `screenshots/landing-dark-mobile.png`
- one category, guide, prevalence/legal equivalent in each theme

Check hierarchy, contrast, borders, focus visibility, textarea/button wrapping, row dividers, mobile menu, and absence of decorative legacy elements. If any issue is found, write a failing regression test where practical, fix it in the owning component, rerun `npm test`, `pnpm run build`, and this visual check.

- [ ] **Step 7: Stop the local server and inspect repository state**

Stop only the Vite process started in Step 5. Then run:

```bash
git status --short
git log --oneline -12
```

Expected: no uncommitted tracked changes; `.superpowers/` may remain untracked and untouched. Generated build/screenshot directories stay ignored.

- [ ] **Step 8: Request final code review**

Apply `superpowers:requesting-code-review` to the complete branch. Resolve any correctness, accessibility, data-integrity, or scope issues, then repeat Steps 2–7 before reporting completion.

---

## Acceptance Checklist

- [ ] Initial homepage has one dominant search action and no default result.
- [ ] Relevant searches return cautious stored-field summaries with at most three PubMed citations.
- [ ] Textual score below 3 cannot qualify through evidence metadata bonuses.
- [ ] Enter submits; Shift+Enter adds a newline; draft editing preserves the current result.
- [ ] Answer heading receives focus and the result is a polite live region.
- [ ] Feed loading/error and no-match states remain honest and actionable.
- [ ] Homepage content is limited to search, Browse topics, Latest studies, and footer beneath the header.
- [ ] Header/footer routes match the approved minimal destinations.
- [ ] Exact clinical tokens render coherently in light and dark modes across every route.
- [ ] Brain code/assets, old highlight card, ornamental CSS, and home image preload are gone.
- [ ] No new dependency, request service, query persistence, or route is present.
- [ ] `npm test`, `pnpm run build`, and the two-theme visual harness pass from fresh runs.
