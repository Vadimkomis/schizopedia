# Schizopedia Features

```gherkin
Feature: Research data pipeline

  Scenario: Fetch articles from PubMed
    Given the fetch script is configured with diagnosis, treatment, and prevention queries
    When `pnpm fetch` runs
    Then articles are written to data/research.json and public/data/research.json with real abstract snippets, evidence metadata, and deduped IDs
    And the status is "completed"

  Scenario: Validate research.json before test runs
    Given a research.json file exists
    When `pnpm validate:data` runs as part of `pnpm test`
    Then structural integrity, required fields, duplicate IDs across all categories, and evidence-level/actionability enum values are checked
    And the status is "completed"

  Scenario: Verify research content against live PubMed records
    Given articles in research.json claim to summarize real PubMed studies
    When `pnpm verify:data` runs (locally or in the weekly refresh workflow before auto-commit)
    Then every PMID is re-queried via esummary and the stored title, journal, and canonical URL must match the live record, the served public copy must be byte-identical to data/research.json, and any unverifiable article fails the run
    And the status is "completed"

  Scenario: Continuous integration on every push and pull request
    Given the CI workflow is configured
    When code is pushed to main or a pull request is opened
    Then GitHub Actions runs `pnpm test` (data validation + unit tests) and `pnpm run build` on Node 20, blocking merges if any step fails
    And the status is "completed"

  Scenario: Automated weekly data refresh
    Given the PubMed feed updates over time
    When the scheduled GitHub Actions job runs every Monday at 09:00 UTC (or is dispatched manually)
    Then `pnpm fetch` refreshes the feed, `pnpm validate:data` checks it, `pnpm verify:data` confirms it against live PubMed, and any changes to data/research.json and public/data/research.json are auto-committed
    And the status is "completed"

  Scenario: Enrich articles with study type, evidence level, and actionability
    Given PubMed reports publication types per article
    When the fetch script writes research.json
    Then scripts/classify.mjs derives studyType, evidenceLevel (synthesis/clinical/exploratory), and actionability per article from pubtypes plus title/abstract keywords, so cards show specific badges instead of "pending" fallbacks
    And the status is "completed"

  Scenario: Deduplicate articles across categories
    Given the same study can match multiple category queries
    When the fetch script assembles the payload
    Then each PMID appears in at most one category (first match wins)
    And the status is "completed"

Feature: Landing page

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

Feature: Caregiver guides

  Scenario: Plain-language guide pages
    Given a visitor navigates to /guide/:id (what-is-schizophrenia, early-warning-signs, getting-help, treatment-explained, caring-for-yourself)
    When the page renders
    Then the guide title, description, and reading time appear in the hero band, followed by a not-medical-advice note and the guide sections (headings, paragraphs, bullet lists, and info/warning callouts including 988 crisis guidance)
    And the status is "completed"

  Scenario: Sequential guide navigation
    Given guides are meant to be read in order
    When a guide page renders
    Then previous/next links navigate between adjacent guides, and the first/last guides omit the missing direction
    And the status is "completed"

  Scenario: Unknown guide redirect
    Given a visitor navigates to /guide/unknown-id
    When the router resolves
    Then they are redirected to the landing page
    And the status is "completed"

Feature: Category detail page

  Scenario: Category state-of-the-field overview
    Given a visitor navigates to /category/diagnosis (or /treatment, /prevention, /cure)
    When the page renders
    Then the category title and summary appear in the hero band, followed by the SafetyPanel and a "Where things stand" panel with a plain-language state-of-the-field summary and a "Documented by" list linking the studies that support it
    And the status is "completed"

  Scenario: Most important and latest research sections
    Given a visitor is on a category detail page
    When the research sections render below the overview
    Then a "Most important research" section lists the curated landmark studies as ArticleCards, and a "Latest research" section lists the newest studies (most recent first) excluding those already featured as most important, followed by the SourcesPanel
    And the status is "completed"

  Scenario: Cure research category page
    Given the Cure category has no dedicated data feed
    When a visitor navigates to /category/cure
    Then the page renders its authored state-of-the-field summary and resolves its cited/important/latest studies by PMID from across the whole dataset (e.g. the muscarinic M1 receptor PET study)
    And the status is "completed"

  Scenario: Evidence legend explains the badges
    Given evidence-level badges can be unfamiliar to lay readers
    When a category page renders
    Then a legend explains the three levels (higher-level synthesis, clinical evidence, early-stage evidence) in plain language and notes that labels derive from PubMed publication types
    And the status is "completed"

  Scenario: Unknown category redirect
    Given a visitor navigates to /category/unknown-id
    When the router resolves
    Then they are redirected to the landing page
    And the status is "completed"

  Scenario: Empty category state
    Given a category has zero articles in data/research.json
    When the detail page renders
    Then the research sections show honest placeholders ("Key studies will appear here after the next refresh." / "No new studies indexed yet. Check back after the next refresh.") instead of article cards
    And the status is "completed"

  Scenario: Article card details
    Given a category has articles
    When each ArticleCard renders
    Then it shows an evidence-level badge, an optional study-type badge, the title linking to the PubMed record in a new tab, the journal/authors/published meta line, the abstract snippet (or a "View full article on PubMed" fallback), and an actionability guidance tag
    And the status is "completed"

  Scenario: Loading and error states
    Given the research feed is still loading or failed to load
    When the category page renders
    Then skeleton cards appear while loading without cached data, and a red error banner is shown above the list if the fetch fails
    And the status is "completed"

Feature: Data loading and resilience

  Scenario: Fetch the research feed on page load
    Given a visitor opens the landing or a category page
    When the page mounts
    Then useResearchData reads embedded prerender data synchronously without fetching when it is available
    And otherwise it fetches /data/research.json and exposes loading, data, and error states
    And the status is "completed"

  Scenario: Handle category and landing feed failures honestly
    Given research.json is missing or fails to load
    When a category page needs research or the landing page needs search data
    Then category pages use the built-in FALLBACK_CATEGORIES (Diagnosis, Treatment, Prevention, Cure Research) and DEFAULT_SOURCES (PubMed) so their research UI still renders
    And the landing page disables evidence search with an unavailable message while static topic routes remain usable
    And the status is "completed"

  Scenario: Handle an empty successful landing feed honestly
    Given research.json loads successfully with an empty categories array
    When the landing page renders and a visitor enters a non-empty question
    Then evidence search remains available and submission shows the honest no-match state
    And static topic routes remain usable while the latest-research section reports that no studies are available
    And the status is "completed"

Feature: Site chrome

  Scenario: Sticky top navigation
    Given a visitor is on any route
    When they scroll
    Then a sticky surface nav persists with the Schizopedia wordmark, Browse, Guides, a theme toggle, and a filled Support link to /donate
    And on mobile Browse, Guides, and the theme toggle collapse behind a hamburger menu while Support remains visible
    And the status is "completed"

  Scenario: Dark/light theme toggle
    Given a visitor clicks the theme toggle
    When the theme changes
    Then the preference is persisted to localStorage and the semantic backgrounds, cards, text, links, and controls adapt
    And the status is "completed"

Feature: Content safety

  Scenario: Educational-use disclaimer on category pages
    Given a visitor views any category detail page
    When the page renders
    Then a "Read this first" safety panel is shown explaining the library is for learning, not diagnosis, and how to escalate emergencies
    And the status is "completed"

Feature: Accessibility

  Scenario: Semantic landmarks and hidden decorations
    Given assistive-tech users browse the site
    When they navigate
    Then the page uses landmark regions (header, main, footer), headings flow 1→2→3, decorative icons are aria-hidden, and source-linked study titles have meaningful accessible names
    And the status is "completed"

Feature: SEO

  Scenario: Per-route meta and social tags
    Given each route needs distinct search and social metadata
    When a page is prerendered (and on client-side navigation via SeoManager)
    Then a unique title, meta description, canonical URL, Open Graph (og:title/description/type/url/image), and Twitter card tags are present in the static HTML for that route, resolved from the pathname by resolveSeo
    And the status is "completed"

  Scenario: Structured data for guides and categories
    Given search engines reward structured data
    When a guide or category page renders
    Then a JSON-LD MedicalWebPage block describing the page (about schizophrenia, linked to the site) is injected into the head
    And the status is "completed"

  Scenario: Sitemap and robots
    Given crawlers need to discover every page
    When `pnpm build` runs
    Then dist/sitemap.xml is generated from the canonical route list (home, five guides, four categories including cure, prevalence, donate, privacy, terms) and public/robots.txt references it
    And the status is "completed"

  Scenario: Static hosting on Cloudflare (Workers static assets)
    Given the site deploys to Cloudflare via Workers static assets (wrangler.toml points at dist) with auto-deploy on push
    When a visitor opens a deep link such as /guide/getting-help directly
    Then not_found_handling = single-page-application serves index.html so client-side routing resolves instead of 404ing, and the Monday research auto-commit triggers an automatic rebuild and redeploy
    And the status is "completed"

Feature: Performance

  Scenario: Prerendered static HTML for every route
    Given a static site should paint instantly without waiting for JavaScript
    When `pnpm build` runs
    Then a Vite SSR bundle prerenders every route (home, guides, categories, legal) to flat <route>.html files with full content and per-route head tags, the research payload is inlined on data routes (no client fetch), and the client hydrates the prerendered markup
    And the status is "completed"

  Scenario: Non-blocking fonts and pre-paint theme
    Given render-blocking resources delay first paint
    When the page loads
    Then fonts load via a non-blocking preload+swap link (text paints immediately in a fallback) and an inline script applies the saved/system theme before paint to avoid a flash
    And the status is "completed"

Feature: Global prevalence

  Scenario: Schizophrenia around the world
    Given a visitor wants to know how common schizophrenia is
    When they open /prevalence from the footer
    Then the page leads with the WHO global figure (about 1 in 300 people / ~24 million / ~0.32%) with a linked source, then shows modelled age-standardized prevalence estimates by country as a sorted bar list credited to IHME Global Burden of Disease, with a caveat that prevalence is strikingly uniform worldwide and that incidence varies more than prevalence
    And the data lives in data/prevalence.json (validated by unit tests) so it can be corrected and expanded
    And the status is "completed"

Feature: Support / donations

  Scenario: In-app donate page never dead-ends
    Given the Support button in the nav and Donate link in the footer both route to /donate
    When a visitor opens the donate page
    Then a "Support Schizopedia" page explains the site is free, ad-free, and privacy-respecting, and offers a working action: a "Donate now" button when a processor URL (VITE_DONATE_URL) is configured, otherwise a "Get in touch to contribute" mailto with a "launching soon" note — so no click leads to a 404
    And the status is "completed"

Feature: Legal pages

  Scenario: Privacy and Terms pages
    Given the footer links to Privacy and Terms & Conditions
    When a visitor clicks either link
    Then dedicated /privacy and /terms pages are shown with a no-tracking privacy policy and education-only terms including a crisis-line notice
    And the status is "completed"

```
