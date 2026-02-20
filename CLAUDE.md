# Schizopedia — Project Instructions

## Stack

- **Framework:** React 18 + TypeScript
- **Build:** Vite 5
- **Styling:** Tailwind CSS 3 + `tailwindcss-animate`
- **UI primitives:** Radix UI (scroll-area), custom Card/Badge components
- **Icons:** lucide-react
- **Testing:** Vitest + Testing Library + jsdom
- **Package manager:** pnpm

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm test` | Validate data + run all tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm fetch` | Fetch fresh articles from PubMed |
| `pnpm validate:data` | Validate `data/research.json` schema |

## Architecture

```
src/
  App.tsx                          # Root: ThemeProvider + ResearchDashboard
  hooks/useResearchData.ts         # Fetches /data/research.json
  lib/format.ts                    # formatDateTime, formatAuthors, buildArticleMeta
  lib/types.ts                     # ResearchArticle, ResearchCategory, ResearchPayload, ResearchSource
  lib/utils.ts                     # cn() utility
  components/research/
    ResearchDashboard.tsx          # Orchestrator (composes sub-components)
    HeroPanel.tsx                  # Hero section with stat pills
    CategoryCard.tsx               # Category card with article list
    ArticleCard.tsx                # Single article item
    SkeletonList.tsx               # Loading skeleton
    SourcesPanel.tsx               # Data sources footer
    constants.ts                   # FALLBACK_CATEGORIES, CATEGORY_ACCENTS, DEFAULT_SOURCES
  components/theme/
    ThemeProvider.tsx               # Dark/light context + localStorage persistence
    ThemeToggle.tsx                 # Toggle button
  components/ui/
    card.tsx, badge.tsx, scroll-area.tsx  # Reusable UI primitives

scripts/
  fetchResearch.mjs                # PubMed esearch → esummary → efetch pipeline
  validateData.mjs                 # Schema validation for research.json

data/research.json                 # Source of truth for article data
public/data/research.json          # Copy served by dev server
```

## Conventions

- Components are one per file, named exports matching filename
- Tailwind classes use `dark:` prefix for dark-mode variants
- All external links use `target="_blank" rel="noreferrer noopener"`
- Tests co-locate with source files (e.g., `ArticleCard.test.tsx` next to `ArticleCard.tsx`)
- Format helpers tested in `src/lib/format.test.ts`
- Hook tests mock `globalThis.fetch`

## Data Flow

1. `scripts/fetchResearch.mjs` queries PubMed and writes to `data/research.json` + `public/data/research.json`
2. At runtime, `useResearchData` fetches `/data/research.json`
3. `ResearchDashboard` receives `{ data, loading, error }` and renders sub-components
4. If data is null or empty, fallback categories from `constants.ts` are used
