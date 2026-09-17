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
  App.tsx                            # BrowserRouter client wrapper
  AppShell.tsx                       # ThemeProvider + lazy shared routes
  hooks/useResearchData.ts           # Reads embedded data or fetches /data/research.json
  lib/evidenceSearch.ts              # Deterministic local scoring and summary
  lib/format.ts                      # formatDateTime, formatAuthors, buildArticleMeta
  lib/topics.ts                      # Shared category destinations
  lib/types.ts                       # Research types
  lib/utils.ts                       # cn() utility
  pages/
    LandingPage.tsx                  # / — search + topics + latest studies
    CategoryPage.tsx                 # /category/:id — per-category article list
  components/landing/
    HeroSection.tsx                  # Search hero and last submitted result state
    EvidenceSearchForm.tsx           # Accessible local question form
    EvidenceAnswer.tsx               # Focused inline summary/no-match state
    EvidenceCitationList.tsx         # Numbered PubMed sources
    BrowseTopics.tsx                 # Four compact category routes
    LatestHighlights.tsx             # Three newest studies as text rows
    SiteNav.tsx                      # Minimal nav + theme toggle
    SiteFooter.tsx                   # Education framing + compact route links
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
- `/category/:id` → `CategoryPage` (valid ids: `diagnosis`, `treatment`, `prevention`, `cure`)
- `/guide/:id` → `GuidePage` (valid ids: `what-is-schizophrenia`, `early-warning-signs`, `getting-help`, `treatment-explained`, `caring-for-yourself`)
- `/prevalence` → `PrevalencePage`
- `/donate` → `DonatePage`
- `/privacy` → `PrivacyPage`
- `/terms` → `TermsPage`
- Unknown paths redirect to `/`

## Data Flow

1. `scripts/fetchResearch.mjs` queries PubMed and writes to `data/research.json` + `public/data/research.json`
2. The prerenderer embeds research data on the landing and category routes; `useResearchData()` reads it synchronously so hydrated prerendered pages do not fetch.
3. When embedded data is absent, `useResearchData()` fetches `/data/research.json` and exposes loading, data, and error states.
4. `LandingPage` passes the loaded categories and feed state to `HeroSection` and `LatestHighlights`; a failed feed disables search while static topic routes remain usable.
5. `HeroSection` submits trimmed questions to `synthesizeEvidence()` entirely in memory and renders `EvidenceAnswer` inline; questions are not sent or persisted.
6. `LatestHighlights` selects the three newest articles across loaded categories; category pages retain their existing fallback-data behavior.
