import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export function TermsPage() {
  return (
    <LegalLayout title="Terms &amp; Conditions" updated="June 10, 2026">
      <LegalSection heading="Educational purpose only">
        <p>
          Schizopedia summarizes peer-reviewed schizophrenia research for
          educational purposes. Nothing on this site is medical advice, a
          diagnosis, or a treatment recommendation. Always consult a licensed
          clinician before making decisions about your health or medication.
        </p>
      </LegalSection>

      <LegalSection heading="If you are in crisis">
        <p>
          If you or someone near you is in immediate danger, contact your
          local emergency number right away. In the United States you can call
          or text 988 (Suicide &amp; Crisis Lifeline).
        </p>
      </LegalSection>

      <LegalSection heading="Content and sources">
        <p>
          Article titles, abstracts, and metadata are retrieved from PubMed and
          remain the property of their respective publishers and authors. Each
          summary links to the primary source. Evidence-level and study-type
          labels are generated automatically from PubMed publication types and
          may occasionally be imprecise — the linked primary source is always
          authoritative.
        </p>
      </LegalSection>

      <LegalSection heading="No warranty">
        <p>
          The site is provided &quot;as is&quot; without warranties of any
          kind. We work to keep the feed accurate and current, but we cannot
          guarantee completeness, accuracy, or availability, and we accept no
          liability for actions taken based on the content.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          We may update these terms as the site evolves. The date above
          reflects the latest revision; continued use after changes means you
          accept the updated terms.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
