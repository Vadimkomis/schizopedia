import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="September 17, 2026">
      <LegalSection heading="What we collect">
        <p>
          Browsing Schizopedia does not require an account. We do not use
          advertising trackers or third-party analytics cookies on this site.
        </p>
      </LegalSection>

      <LegalSection heading="Local storage">
        <p>
          Your dark/light theme preference is saved in your browser&apos;s
          local storage. It never leaves your device and can be cleared at any
          time through your browser settings.
        </p>
      </LegalSection>

      <LegalSection heading="Contributions">
        <p>
          Online contributions are processed on Stripe&apos;s
          website. Stripe collects the information needed to process your
          payment and may share contribution records and contact details with
          us. We use these details to manage contributions and support requests.
          Payment details are entered on Stripe&apos;s website.
        </p>
        <p>
          Stripe may also collect device and usage information under its{" "}
          <a
            href="https://stripe.com/privacy"
            className="text-brand-700 underline dark:text-brand-300"
          >
            Privacy Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="External links">
        <p>
          Articles link to PubMed (a service of the U.S. National Library of
          Medicine). Once you leave Schizopedia, those sites&apos; own privacy
          policies apply.
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
          If you email us, we receive your email address and the information
          you include so we can respond to your request.
        </p>
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
