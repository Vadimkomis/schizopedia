/**
 * Editorial "state of the field" content for each category page.
 *
 * The summaries are written in plain language for families and caregivers and
 * describe the *field* — facts that hold regardless of which studies happen to
 * be indexed this week. The studies shown under each summary ("Documented by"),
 * in "Most important research", and in "Latest research" are NOT hardcoded:
 * they are selected at runtime from the live PubMed feed (see lib/articles.ts).
 * This keeps the pages correct as the feed refreshes every Monday.
 *
 *  - `pool: "own"`   — draw studies from this category's own article feed.
 *  - `pool: "cross"` — draw from every category, filtered by `keywords`
 *                      (used by Cure, which has no dedicated feed).
 */
export interface CategoryContent {
  id: string;
  title: string;
  /** One-line summary used for the page hero and SEO. */
  summary: string;
  /** Longer SEO meta description. */
  seoDescription: string;
  /** Plain-language "where things stand right now", as evergreen paragraphs. */
  stateOfField: string[];
  /** Where to source the studies shown on the page. */
  pool: "own" | "cross";
  /** For `pool: "cross"`, keywords (matched in title/abstract) that select
   *  relevant studies from across the whole dataset. */
  keywords?: string[];
}

const CONTENT: Record<string, CategoryContent> = {
  diagnosis: {
    id: "diagnosis",
    title: "Diagnosis",
    summary:
      "Innovative tools and biomarkers are improving early and accurate diagnosis.",
    seoDescription:
      "Where schizophrenia diagnosis stands in 2026: it is still made from a clinical interview, but brain imaging, genetic risk scores, and metabolic and immune biomarkers are pushing toward earlier, more precise, more personalised diagnosis. See the latest studies.",
    stateOfField: [
      "There is still no blood test or brain scan that diagnoses schizophrenia on its own. A diagnosis is made by a clinician using a structured interview and the symptom criteria in the DSM-5, usually after symptoms have persisted for at least six months. That means diagnosis can take time and is sometimes revised.",
      "What is changing fast is the search for objective biological markers. Researchers are combining brain-imaging methods, testing whether genetic risk scores can flag vulnerability earlier, and looking for signatures in metabolism and the immune system that a clinical interview cannot see. Machine-learning tools are increasingly used to weave these signals together.",
      "The bigger shift is toward personalised, individual-level prediction rather than group averages. If these biomarkers hold up, diagnosis could become earlier and more precise, and schizophrenia may prove to be several conditions with different biology rather than one — which would change how it is identified and treated.",
    ],
    pool: "own",
  },
  treatment: {
    id: "treatment",
    title: "Treatment",
    summary:
      "Emerging therapies, medications, and models of care are improving quality of life.",
    seoDescription:
      "Where schizophrenia treatment stands in 2026: antipsychotics remain first-line, clozapine is best for resistant cases, and the frontier is personalised medication, brain stimulation, cognitive care, and targeting the genes and circuits behind the illness. See the latest studies.",
    stateOfField: [
      "Antipsychotic medication is still the foundation of treatment and, for most people, meaningfully reduces symptoms and the risk of relapse. But roughly one in three people have schizophrenia that does not respond well to the usual medicines — researchers are even re-examining what \"treatment-resistant\" should mean — and for that group clozapine remains the most effective option.",
      "Much of today's research is about doing better than one-size-fits-all: matching medication and dose to the individual, managing side effects and cognition, and using non-drug approaches such as brain stimulation for the symptoms that medication treats poorly.",
      "In parallel, laboratory work is tracing how specific risk genes and brain circuits shape the illness. These studies are early and not yet treatments, but they point toward future therapies that act on the underlying biology rather than only dampening symptoms.",
    ],
    pool: "own",
  },
  prevention: {
    id: "prevention",
    title: "Prevention",
    summary:
      "Research is focused on reducing risk factors and protecting long-term health.",
    seoDescription:
      "Where schizophrenia prevention stands in 2026: there is no single way to prevent it, so research targets early prediction, physical-health protection, family and caregiver wellbeing, and mental-health literacy. See the latest studies.",
    stateOfField: [
      "No intervention can reliably prevent schizophrenia from developing, so \"prevention\" today means three things: predicting who is most at risk as early as possible, reducing modifiable risks, and preventing the harms that follow a diagnosis.",
      "A large share of that harm is physical, not psychiatric. People with schizophrenia face higher cardiovascular risk and shorter life expectancy, which is driving research into heart health, and studies keep uncovering shared biology with other conditions that points to earlier, broader screening.",
      "Prevention research also looks beyond the patient — at protecting family caregivers, improving mental-health literacy so warning signs are recognised sooner, and supporting work and social recovery. The recurring theme is acting early on the risks we can actually change.",
    ],
    pool: "own",
  },
  cure: {
    id: "cure",
    title: "Cure Research",
    summary:
      "Understanding the causes of schizophrenia and the long search for a cure.",
    seoDescription:
      "Is there a cure for schizophrenia? Not yet — but 2026 research is closing in on the causes: risk genes, brain development, neurotransmitter systems, inflammation and metabolism. See the mechanism and cause studies driving the search.",
    stateOfField: [
      "There is no cure for schizophrenia today. It is managed as a long-term condition, and for many people symptoms can be controlled well enough to live full lives — but the underlying illness is not yet reversible. Being honest about that matters, because unproven \"cures\" can be harmful.",
      "What is genuinely new is that research is closing in on the biology that could one day be treated at the source. Studies are pinpointing specific risk genes and showing how they disrupt the developing brain, mapping the neurotransmitter systems involved, and probing the roles of inflammation, metabolism and growth factors in how the illness begins.",
      "None of this is a cure yet. But together these threads turn \"cause\" from a mystery into a set of specific, testable targets — the necessary groundwork for therapies that could one day change the course of the illness rather than only manage its symptoms.",
    ],
    pool: "cross",
    keywords: [
      "cause", "etiolog", "pathogen", "pathophysiolog", "mechanism",
      "receptor", "muscarinic", "dopamine", "glutamate", "synap",
      "complement", "microglia", "neuroinflamm", "inflamm", "immune",
      "genetic", "genom", "gene", "risk score", "neurodevelopment",
      "molecular", "cellular", "pathway", "metabolom", "metabolic",
      "growth factor", "biomarker", "disease-modif",
    ],
  },
};

export const CATEGORY_CONTENT_IDS = Object.keys(CONTENT);

export function getCategoryContent(id: string): CategoryContent | undefined {
  return CONTENT[id];
}
