import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="June 10, 2026">
      <LegalSection heading="What we collect">
        <p>
          Schizopedia does not require an account and does not collect, store,
          or sell personal information. We do not use advertising trackers or
          third-party analytics cookies.
        </p>
      </LegalSection>

      <LegalSection heading="Local storage">
        <p>
          Your dark/light theme preference is saved in your browser&apos;s
          local storage. It never leaves your device and can be cleared at any
          time through your browser settings.
        </p>
      </LegalSection>

      <LegalSection heading="External links">
        <p>
          Articles link to PubMed (a service of the U.S. National Library of
          Medicine) and the donate button links to Open Collective. Once you
          leave Schizopedia, those sites&apos; own privacy policies apply.
        </p>
      </LegalSection>

      <LegalSection heading="Hosting logs">
        <p>
          Like most websites, our hosting provider may keep standard server
          logs (IP address, browser type, pages requested) for security and
          operational purposes. We do not use these logs to identify visitors.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about this policy? Email{" "}
          <a
            href="mailto:info@myclok.com"
            className="text-brand-700 underline dark:text-brand-300"
          >
            info@myclok.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
