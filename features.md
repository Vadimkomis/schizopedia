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

  Scenario: Hero section with primary CTAs
    Given a visitor lands on /
    When the page renders
    Then they see the caregiver-first headline "When schizophrenia touches someone you love, start here.", a plain-language supporting description, and two CTAs: filled "Start Here" (scrolls to the guide section) and outlined "Explore Research"
    And a decorative anatomical brain SVG with animated synapse nodes appears on the right, with three metric tiles (brain, trend spark, studies-indexed count)
    And the status is "completed"

  Scenario: Honest stats band under the hero
    Given research data has loaded
    When the hero stats band renders
    Then it shows real, verifiable numbers only: peer-reviewed studies indexed, weekly automatic PubMed refresh, 100% linked to primary sources, and the last-refreshed timestamp (no synthetic "research progress" percentage)
    And the status is "completed"

  Scenario: Start-here guide cards
    Given a visitor with no scientific background lands on /
    When the start-here section renders (directly below the hero)
    Then five guide cards are shown in reading order (What it is, Warning signs, Getting help, Treatment, For caregivers), each with an icon, guide number, reading time, title, description, and a link to /guide/:id
    And the status is "completed"

  Scenario: Four category entry cards
    Given a visitor views the category grid
    When the section renders
    Then four cards are shown: Cure Research (static), Diagnosis, Treatment, and Prevention, each with a pastel circular icon, title, description, and "Learn more →" link
    And the backing categories deep-link to /category/:id detail pages
    And the status is "completed"

  Scenario: Latest research highlights
    Given research data has loaded
    When the highlights section renders
    Then the three most recently published articles across all categories are shown as cards with a gradient placeholder header, category chip (Neuroscience / Imaging / Biomarkers), published date, title, truncated abstract, and "Read summary →" link to PubMed
    And while loading without any data, three skeleton cards are displayed instead
    And the status is "completed"

  Scenario: About section
    Given a visitor scrolls to the about block
    When the section renders
    Then a mint-tinted rounded card shows the "About Schizopedia" eyebrow, the headline "Making Research Accessible. Empowering Minds.", a mission paragraph, an orbital brain illustration, and three value props (Evidence-Based, Accessible for All, Independent & Trusted)
    And the status is "completed"

  Scenario: Smooth-scroll to in-page sections
    Given a visitor follows a hash link such as /#categories or /#about
    When the landing page loads or the hash changes
    Then the matching section is smoothly scrolled into view
    And the status is "completed"

  Scenario: Site footer with subscribe field
    Given a visitor reaches the footer
    When it renders
    Then the Schizopedia wordmark, tagline "Knowledge today. Better tomorrows.", Privacy and Terms links, and a compact email subscribe field are visible (the Donate button lives only in the sticky nav)
    And the status is "completed"

  Scenario: Email subscribe band
    Given a visitor finishes the Latest Highlights section
    When the subscribe band renders (between highlights and the About block)
    Then it pitches the real Monday refresh cadence ("New research lands every Monday"), validates the email address, and on valid submit shows an honest launching-soon message stating the address was not stored
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

  Scenario: Per-category article list
    Given a visitor navigates to /category/diagnosis (or /treatment, /prevention)
    When the page renders
    Then the category title and summary appear in the hero band, followed by the SafetyPanel, the EvidenceLegend, the full article list (ArticleCard per study), and the SourcesPanel
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
    Then a "No articles indexed for this category yet" placeholder is shown instead of the article list
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
    Then useResearchData fetches /data/research.json with a cache-busting query param and exposes loading, data, and error states
    And the status is "completed"

  Scenario: Fall back to default categories and sources
    Given research.json is missing, empty, or fails to load
    When a page needs categories or sources
    Then the built-in FALLBACK_CATEGORIES (Diagnosis, Treatment, Prevention) and DEFAULT_SOURCES (PubMed) are used so the UI still renders
    And the status is "completed"

Feature: Site chrome

  Scenario: Sticky top navigation
    Given a visitor is on any route
    When they scroll
    Then a sticky white/translucent nav persists with the Schizopedia wordmark (links to /), Start Here/Research/Diagnosis/Treatment/Prevention links, a filled Donate button (opens externally), and an icon-only theme toggle on desktop
    And the status is "completed"

  Scenario: Dark/light theme toggle
    Given a visitor clicks the theme toggle
    When the theme changes
    Then the preference is persisted to localStorage and every surface (hero band, cards, illustrations, gradients) adapts
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
    Then the page uses landmark regions (header, main, footer), headings flow 1→2→3, decorative icons and illustrations are aria-hidden, and the highlight card provides a meaningful aria-label for its "Read summary" link
    And the status is "completed"

Feature: SEO

  Scenario: Meta and social tags
    Given a crawler or social card generator fetches /
    When index.html is served
    Then meta description, Open Graph (og:title, og:description, og:type), and Twitter card tags are present
    And the status is "completed"

Feature: Legal pages

  Scenario: Privacy and Terms pages
    Given the footer links to Privacy and Terms & Conditions
    When a visitor clicks either link
    Then dedicated /privacy and /terms pages are shown with a no-tracking privacy policy and education-only terms including a crisis-line notice
    And the status is "completed"

Feature: Planned

  Scenario: Search across articles
    Given a visitor wants to find a specific topic
    When they use a future search input
    Then articles across categories are filtered by keyword
    And the status is "planned"

  Scenario: Deliver the weekly email digest
    Given the subscribe UI is live but no email provider is connected
    When an email provider account (e.g. Buttondown) is created and wired to the form
    Then submitted addresses are stored with the provider and a weekly digest of newly fetched studies is delivered every Monday
    And the status is "planned"

  Scenario: Real imagery on highlight cards
    Given placeholder gradients are acceptable but not ideal
    When per-article image URLs are added to data/research.json
    Then HighlightCard renders the photo with the gradient as fallback
    And the status is "planned"
```
