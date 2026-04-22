# Schizopedia — Project Instructions

## Stack

- **Framework:** React 18 + TypeScript
- **Routing:** react-router-dom v7
- **Build:** Vite 5
- **Styling:** Tailwind CSS 3
- **UI primitives:** Custom Card / Badge components
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
  App.tsx                            # ThemeProvider + BrowserRouter routes
  hooks/useResearchData.ts           # Fetches /data/research.json
  lib/format.ts                      # formatDateTime, formatAuthors, buildArticleMeta
  lib/types.ts                       # Research types
  lib/utils.ts                       # cn() utility
  pages/
    LandingPage.tsx                  # / — hero + category grid + highlights + about + footer
    CategoryPage.tsx                 # /category/:id — per-category article list
  components/landing/
    SiteNav.tsx                      # Sticky top nav with wordmark + theme toggle
    HeroSection.tsx                  # Hero band with CTAs, brain illustration, metric tiles
    CategoryIconCard.tsx             # Pastel-tint icon card (Cure / Diagnosis / Treatment / Prevention)
    LatestHighlights.tsx             # Picks 3 most recent articles; exports formatPublishedShort
    HighlightCard.tsx                # Gradient-header article card
    AboutSection.tsx                 # Teal "About" block with value props
    SiteFooter.tsx                   # Wordmark, legal links, donate CTA
  components/research/
    ArticleCard.tsx                  # Single article item (used by CategoryPage)
    SafetyPanel.tsx                  # Educational-use disclaimer (used by CategoryPage)
    SourcesPanel.tsx                 # Data sources (used by CategoryPage)
    SkeletonList.tsx                 # Article loading skeleton
    constants.ts                     # FALLBACK_CATEGORIES, DEFAULT_SOURCES
  components/theme/
    ThemeProvider.tsx                # Dark/light context + localStorage persistence
    ThemeToggle.tsx                  # Toggle button
  components/ui/
    card.tsx, badge.tsx              # Reusable UI primitives

scripts/
  fetchResearch.mjs                  # PubMed esearch → esummary → efetch pipeline
  validateData.mjs                   # Schema validation for research.json

data/research.json                   # Source of truth for article data
public/data/research.json            # Copy served at /data/research.json
```

## Conventions

- Components are one per file, named exports matching filename
- Tailwind classes use `dark:` prefix for dark-mode variants
- All external links use `target="_blank" rel="noreferrer noopener"`
- Tests co-locate with source files (e.g., `ArticleCard.test.tsx` next to `ArticleCard.tsx`)
- React Router tests wrap rendered trees in `<MemoryRouter>`
- Format helpers tested in `src/lib/format.test.ts`
- Hook tests mock `globalThis.fetch`

## Routing

- `/` → `LandingPage`
- `/category/:id` → `CategoryPage` (valid ids: `diagnosis`, `treatment`, `prevention`)
- Unknown paths redirect to `/`

## Data Flow

1. `scripts/fetchResearch.mjs` queries PubMed and writes to `data/research.json` + `public/data/research.json`
2. At runtime, pages call `useResearchData()` which fetches `/data/research.json`
3. `LandingPage` derives a "Latest Highlights" set (top 3 by published date across categories) and populates the 3 data-backed category cards (Diagnosis / Treatment / Prevention); `Cure Research` is a static card
4. `CategoryPage` renders a single category's articles using `ArticleCard`, with `SafetyPanel` + `SourcesPanel`
5. If data is null or empty, fallback categories from `constants.ts` are used
