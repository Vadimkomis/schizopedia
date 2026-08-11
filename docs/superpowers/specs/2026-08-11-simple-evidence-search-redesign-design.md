# Simple Evidence Search Redesign

**Date:** 2026-08-11
**Status:** Approved design
**Product:** Schizopedia

## Summary

Schizopedia will move from a dense, multi-panel homepage to a quiet, search-first clinical-reference experience inspired by the clarity of Doximity Ask. The redesign will preserve Schizopedia's content, routes, PubMed data pipeline, safety framing, prerendering, and light/dark theme support while removing visual and conceptual clutter.

The homepage will have four parts only: an evidence search, compact topic links, three latest studies, and the footer. Search will remain deterministic and run entirely against Schizopedia's existing curated PubMed index. It will not call an AI service, require a backend, or add production dependencies.

## Goals

- Make the homepage understandable within a few seconds.
- Make the evidence search the single primary action.
- Return short, cautious, source-linked results directly below the search box.
- Preserve access to the existing research categories, guides, prevalence, donation, and legal pages.
- Establish a restrained clinical visual system that works in light and dark modes.
- Reduce shipped code and assets by removing obsolete brain artwork and landing-page ornamentation.

## Non-goals

- A generative-AI or retrieval-augmented-generation backend.
- A conversational chat history or user accounts.
- A 3D brain explorer or anatomical region pages.
- New research feeds, routes, or editorial content.
- A rewrite of the existing guide, category, prevalence, donation, privacy, or terms information architecture.
- Copying Doximity branding, proprietary assets, typography, or exact layouts.

## Product decisions

- The earlier Titan-inspired and 3D-brain concepts are superseded by this design.
- Doximity is an interaction and restraint reference only.
- The existing deterministic `synthesizeEvidence()` workflow remains the search foundation.
- Search results expand inline on the homepage rather than navigating to another route.
- Results contain a short summary and at most three cited PubMed studies.
- No answer is visible before the visitor submits a question.
- Light and dark themes remain available through the existing persisted theme toggle.
- No production dependency will be added.

## Homepage experience

### Header

The sticky header contains only:

- Schizopedia wordmark linking to `/`.
- `Browse` linking to `/#topics`.
- `Guides` linking to `/guide/what-is-schizophrenia`.
- Theme toggle.
- `Support` linking to `/donate`.

The mobile header uses the existing accessible menu pattern with the same destinations. The old `Ask AI`, `Evidence`, and `Research` navigation labels are removed.

### Search hero

The hero is centered in a narrow reading column and contains:

1. Trust label: `Independent · source-linked · updated weekly`.
2. Heading: `What would you like to understand?`
3. Supporting copy explaining that visitors can search plain-language summaries of curated schizophrenia research.
4. A prominent question field with the placeholder `Ask about symptoms, treatment, diagnosis, or family support…`.
5. A `Search evidence` submit button.

The hero does not include a decorative brain, evidence-network diagram, default answer, stats grid, suggestion chips, source rail, or competing calls to action.

The submit button is disabled when the trimmed query is empty or the research feed is still loading. Enter submits; Shift+Enter inserts a new line.

### Inline result

After submission, an answer region expands directly below the form. It contains:

- A heading formatted as `Evidence for “{question}”`.
- One evidence-strength label: `Synthesis-led`, `Clinical signal`, `Emerging evidence`, or `No direct match`.
- A short source-derived summary.
- Up to three matching citations.
- A compact educational-use disclaimer.

Each citation shows the study title, journal when available, study type when available, publication date, and a direct external PubMed link. Citations use a numbered list and open in a new tab with safe external-link attributes.

The result heading receives programmatic focus after submission, and the result container uses polite live-region behavior so keyboard and assistive-technology users are notified without interruption.

Typing a new question does not discard the current result. Submitting replaces it atomically with the next result.

### No-match and error states

If a query does not meet the relevance threshold, the result states that the current index has no close source match and offers links to the four topic collections. It does not fabricate an answer or recommend care.

If the research feed fails, the form remains visible but submission is unavailable. A compact `Search index unavailable` message directs visitors to browse topics while the rest of the page remains usable.

If the feed is merely loading, the button label changes to `Loading index…`; no full-page skeleton is needed.

### Browse topics

The `#topics` section contains four compact text-led links:

- Cure research
- Diagnosis
- Treatment
- Prevention and early support

These retain the existing `/category/:id` destinations. They use a simple bordered list or two-column grid, not the current large pastel icon cards.

### Latest research

The latest section shows the three newest studies across all categories. Each row contains category, publication date, title, a short excerpt, and a PubMed link. Decorative gradient image headers are removed.

While data is loading, three low-contrast text-row skeletons are acceptable. If no data exists, the section shows one honest empty-state sentence.

### Footer

The footer retains the Schizopedia wordmark and educational-use framing with compact links to Guides, Prevalence, Donate, Privacy, and Terms. Newsletter or unused acquisition controls are not introduced.

## Search behavior

### Data source

`useResearchData()` remains the only runtime data source. It fetches `/data/research.json`, and search operates on the resulting `ResearchCategory[]` in memory. Questions are not sent to a server and are not persisted.

### Ranking

`synthesizeEvidence()` keeps its deterministic scoring model with these explicit rules:

- Normalize Unicode, case, punctuation, and whitespace.
- Remove stop words and expand the existing curated synonym groups.
- Reward a complete normalized query phrase in a title most strongly.
- Weight token matches in this order: title, abstract snippet, evidence metadata/tags, category text.
- Calculate a textual relevance score before applying any evidence-level bonus.
- Require the textual score to meet `MIN_RELEVANCE_SCORE = 3`; category-only and single weak snippet matches must not qualify.
- Apply small evidence-level bonuses only to order already-qualified matches, never to make a weak match qualify.
- Break equal scores by most recent publication date.
- Return at most three matches.

Synonym changes must remain explicit and reviewed in source code. The implementation will not add opaque semantic embeddings, external services, or a fuzzy-search dependency.

### Summary construction

The summary is composed only from stored fields:

- The top study's title and study type.
- The first complete sentence of its stored abstract snippet when available.
- Existing cautious language based on `evidenceLevel`.

It must never infer a diagnosis, recommend starting or stopping treatment, claim causation from observational work, or describe itself as AI-generated.

## Visual system

The design uses Schizopedia-specific tokens influenced by contemporary clinical-reference interfaces:

| Role | Light | Dark |
|---|---|---|
| Page background | `#f7f9fc` | `#0d1522` |
| Primary surface | `#ffffff` | `#141f30` |
| Secondary surface | `#f1f5f9` | `#192638` |
| Primary text | `#162033` | `#eef4fb` |
| Muted text | `#5f6b7a` | `#a5b2c2` |
| Border | `#dce3ec` | `#2a3a4f` |
| Accent | `#2563eb` | `#78a9ff` |
| Accent hover | `#1d4ed8` | `#9bbfff` |

Public Sans remains the interface and body face. Newsreader remains available for the wordmark and restrained editorial headings. The redesign does not add font packages.

Shared styling principles:

- Thin borders instead of ornamental gradients.
- One primary accent color per surface.
- Moderate corner radii rather than oversized pill/card treatments.
- Clear type hierarchy and generous whitespace.
- Motion limited to short state transitions and disabled under `prefers-reduced-motion`.
- Focus rings remain visible in both themes.

The same tokens and principles apply to category, guide, prevalence, donation, legal, navigation, and footer surfaces. Their content and route behavior remain unchanged.

## Component boundaries

The implementation should keep components focused:

- `HeroSection`: search-hero composition and submitted-query state.
- `EvidenceSearchForm`: labeled textarea, loading state, and submit behavior.
- `EvidenceAnswer`: result heading, signal, summary, disclaimer, and no-match state.
- `EvidenceCitationList`: numbered external-source links.
- `BrowseTopics`: compact category destinations.
- `LatestHighlights`: simplified three-row research list.
- `SiteNav` and `SiteFooter`: simplified global navigation.

Search scoring and summary construction stay in `src/lib/evidenceSearch.ts`; UI components do not duplicate ranking logic.

Small components may remain in the same file when they are private to one parent and independently extracting them would add navigation overhead. Public reusable units get their own file and co-located tests.

## Landing-page removals

The homepage no longer renders:

- `EvidenceSourceRail`
- `StartHereSection`
- `WorldPrevalenceTeaser`
- `AboutSection`
- the current `EvidenceNetwork`
- the current hero stats grid
- suggestion-question chips
- default submitted question/results

Guide and prevalence routes remain reachable through global navigation or the footer.

After reference checks, remove unused brain-only code and assets, including obsolete `BrainScene`, `BrainIllustration`, their tests, and brain hero imagery. Delete an asset only after `rg` confirms it has no remaining consumer in source, HTML, CSS, scripts, or prerender configuration.

## Accessibility

- Preserve semantic header, main, section, nav, and footer landmarks.
- Maintain one page-level `h1` and sequential heading levels.
- Give the search form and field explicit accessible names.
- Keep all search and navigation behavior usable with keyboard alone.
- Move focus to the answer heading only after an intentional submission.
- Expose result changes with `aria-live="polite"`.
- Ensure text, borders, focus indicators, and controls satisfy WCAG AA contrast in both themes.
- Respect system color preference on first visit and persist explicit user choice.
- Avoid animation that is required to understand state.

## SEO and prerendering

- Preserve the current BrowserRouter/StaticRouter architecture and all prerendered routes.
- Keep the homepage search form and empty initial state in prerendered HTML.
- Do not serialize questions or answers into the URL in this scope.
- Update homepage metadata and structured copy only if existing SEO tests require the new search-first framing.
- Preserve sitemap generation and route synchronization tests.

## Testing and verification

Implementation follows test-driven development. Required coverage includes:

### Search unit tests

- Exact title phrases rank above partial matches.
- Synonyms continue to map expected concepts.
- Evidence bonuses never create a match without textual relevance.
- Scores below 3 return no match.
- Ties prefer the newer study.
- Results are capped at three.
- Synthesis, clinical, exploratory, and no-match language remains appropriately cautious.

### Component tests

- Initial hero has no generated answer.
- Empty queries cannot submit.
- Loading disables search and presents the loading label.
- Submitting renders the summary and matching PubMed links inline.
- Enter submits and Shift+Enter does not.
- The result heading receives focus.
- No-match and feed-error states are actionable and honest.
- Removed network, stats, source rail, and suggestion chips are absent.
- Topic and global navigation destinations are correct.

### Page and regression tests

- Homepage renders search, four topics, latest research, and footer only.
- Existing category, guide, prevalence, donation, privacy, and terms routes continue to render.
- Theme selection still persists and both themes use valid classes/tokens.
- SEO, route-sync, data validation, prerendering, and sitemap tests continue to pass.

### Required commands

- `npm test` after JavaScript/TypeScript changes, per repository instructions.
- `pnpm run build` after implementation.
- The existing visual-check workflow for responsive light and dark review when available.

## Acceptance criteria

The work is complete when:

1. The homepage initially presents one dominant evidence-search action and no default answer.
2. A relevant submitted question produces a cautious inline summary with no more than three PubMed citations.
3. Weak and absent matches produce an honest no-results state.
4. The homepage contains only search, compact topics, latest research, and footer beneath the header.
5. Light and dark modes are polished, accessible, and persistent.
6. Existing content routes, data refresh, SEO, and prerendering remain operational.
7. No new production dependency or backend service is introduced.
8. Verified-unused brain code and assets are removed.
9. `npm test` and `pnpm run build` pass.

## References

- Doximity homepage interaction reference: <https://www.doximity.com/>
- Doximity Ask product overview: <https://www.doximity.com/ask/overview>
