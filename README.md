# Schizopedia

Open-source, plain-language schizophrenia research directory for non-specialists.

## Mission

Make current schizophrenia research easier to understand without dumbing it down:

- Use verifiable sources (PubMed links on every card).
- Explain evidence quality in simple terms.
- Help people ask better questions, not self-diagnose.

## Audience

- People living with symptoms or a diagnosis.
- Family members and caregivers.
- Curious readers who want research they can verify.

This is educational content, not medical advice.

## Research map

- `Diagnosis`: early signs, screening, biomarkers, differential diagnosis work.
- `Treatment`: medications, psychosocial treatment, relapse-related care.
- `Risk Reduction & Early Support`: early intervention, first-episode support, and risk-focused research.

## Evidence framing

Each article card includes:

- `Evidence level`: early-stage, clinical, or higher-level synthesis.
- `Study type`: review, clinical study, observational, etc.
- `Action hint`: whether to treat the result as early signal vs discussion-ready.

## Local development

```bash
pnpm install
pnpm dev
pnpm test
```

## Data refresh

```bash
pnpm fetch
pnpm test
```

`pnpm fetch` updates:

- `data/research.json`
- `public/data/research.json`

## Curation rules

- Keep article links resolvable to PubMed.
- Prefer recent studies while preserving category relevance.
- Avoid duplicate PubMed IDs across categories.
- Reject placeholder snippets when abstracts are unavailable.

## Contributing

1. Open an issue with the change you want.
2. Keep edits plain-language and source-verifiable.
3. Run `pnpm test` before opening a PR.
