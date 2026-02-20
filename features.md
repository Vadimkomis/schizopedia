# Schizopedia Features

## Research Directory

| Feature | Status | Description |
|---------|--------|-------------|
| PubMed data pipeline | completed | Fetches articles from PubMed's esearch/esummary/efetch APIs for diagnosis, treatment, and prevention categories |
| Real abstracts | completed | Snippets are real abstract excerpts (up to 250 chars) from efetch, not DOIs |
| Diagnosis category | completed | Articles on early detection, biomarkers, imaging, and screening tools |
| Treatment category | completed | Articles on medications, psychotherapy, and intervention approaches |
| Prevention category | completed | Articles on prodromal signs, risk reduction, and early intervention |
| Data validation | completed | `scripts/validateData.mjs` ensures structural integrity of research.json |

## UI & Design

| Feature | Status | Description |
|---------|--------|-------------|
| Hero panel | completed | Displays site heading, description, and live stat pills (last refresh, article count, category count) |
| Category cards | completed | Each research category renders as a card with article list and scroll area |
| Article cards | completed | Each article shows title, journal/authors/date meta, abstract snippet, and PubMed link |
| Loading skeletons | completed | Pulse-animated placeholders while data loads |
| Sources panel | completed | Footer section showing data sources with visit links |
| Dark/light theme toggle | completed | Persisted toggle using localStorage, respects system preference |
| Light mode text fix | completed | Category index numbers visible in both light and dark modes |

## Accessibility

| Feature | Status | Description |
|---------|--------|-------------|
| Skip navigation link | completed | sr-only link to jump past hero to research categories |
| Decorative dot aria-hidden | completed | Green dots in article cards hidden from screen readers |
| Semantic landmarks | completed | Sections use proper ARIA attributes (aria-busy, aria-live) |

## SEO

| Feature | Status | Description |
|---------|--------|-------------|
| Meta description | completed | Description meta tag for search engines |
| Open Graph tags | completed | og:title, og:description, og:type for social sharing |
| Twitter card tags | completed | twitter:card, twitter:title, twitter:description |

## Planned

| Feature | Status | Description |
|---------|--------|-------------|
| Search/filter articles | planned | Allow users to search within articles by keyword |
| Article bookmarking | planned | Let users save articles to revisit later |
| Automated weekly refresh | planned | GitHub Actions cron job to run fetch script weekly |
