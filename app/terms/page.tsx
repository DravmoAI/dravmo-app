import { DashboardLayout } from "@/components/dashboard-layout";
import { FooterSection } from "@/components/landing/footer-section";
import { Navigation } from "@/components/landing/navigation";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Navigation />
      <div className="prose prose-gray max-w-none mt-20">
        <h1 className="text-3xl font-bold mb-8">Dravmo Terms and Conditions</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: July 23, 2025</p>

        <p className="mb-6">
          Welcome to Dravmo! These Terms and Conditions ("Terms") govern your access to and use of
          Dravmo's website, mobile applications, and related services (collectively, the
          "Services"). By accessing or using our Services, you agree to be bound by these Terms. If
          you do not agree, do not use the Services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Definitions</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>"Dravmo," "we," "our," "us":</strong> Refers to Dravmo, Inc., a Delaware C
            Corporation, its affiliates, and subsidiaries.
          </li>
          <li>
            <strong>"User," "you," "your":</strong> Any person or entity accessing or using the
            Services.
          </li>
          <li>
            <strong>"Content":</strong> All text, images, graphics, video, audio, software, and
            other materials provided through the Services.
          </li>
          <li>
            <strong>"AI Features":</strong> Any functionality powered by artificial intelligence,
            machine learning, or related technologies.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Acceptance of Terms</h2>
        <p className="mb-4">
          By using Dravmo's Services, you warrant that you are at least 18 years old, have the legal
          capacity to enter into these Terms, and agree to abide by all provisions herein.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Changes to Terms</h2>
        <p className="mb-4">
          We may update these Terms at any time. We will notify you of material changes by posting
          the revised Terms on our platform and updating the "Last updated" date. Continued use
          after changes constitutes acceptance.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Registration and Accounts</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>Account Creation:</strong> To access certain features, you must register an
            account. Provide accurate and complete information.
          </li>
          <li>
            <strong>Security:</strong> You are responsible for safeguarding your login credentials.
            Notify us immediately of unauthorized use.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Conduct and Obligations</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>Lawful Use:</strong> Use the Services only for lawful purposes. Do not infringe
            the rights of others.
          </li>
          <li>
            <strong>Prohibited Activities:</strong> No reverse engineering, scraping, spamming,
            introducing malware, or any abusive behavior.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. AI and Data Collection Permissions</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">Consent to AI Processing</h3>
        <p className="mb-4">
          You acknowledge and agree that Dravmo may process Content and data you submit through AI
          Features. This includes automated analysis, feedback generation, and improvement of AI
          models.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Data Collection</h3>
        <p className="mb-2">We collect data such as:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Usage analytics (e.g., time spent on pages, features used)</li>
          <li>Content metadata (e.g., file names, formats)</li>
          <li>Account information (e.g., email, name)</li>
          <li>Device and network data (e.g., IP address, browser type)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Use of Data</h3>
        <p className="mb-2">Collected data may be used to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide and improve Services</li>
          <li>Train and enhance AI models</li>
          <li>Conduct research and analytics</li>
          <li>Personalize user experience</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Anonymization</h3>
        <p className="mb-4">Personal data used for model training is anonymized and aggregated.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>Dravmo IP:</strong> All intellectual property rights in Dravmo content,
            software, and AI models are owned by Dravmo or its licensors.
          </li>
          <li>
            <strong>Your Content:</strong> You retain ownership of your submitted Content, but grant
            Dravmo a worldwide, royalty-free license to use, reproduce, and process your Content as
            described in these Terms.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Privacy Policy</h2>
        <p className="mb-4">
          Your use of the Services is also governed by our{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          , which is incorporated by reference.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Third-Party Services and Links</h2>
        <p className="mb-4">
          The Services may contain links to third-party websites or integrations. Dravmo is not
          responsible for third-party content or practices.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Disclaimers and Warranties</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>"AS IS":</strong> Services are provided "as is" and "as available". Dravmo
            disclaims all warranties, whether express or implied.
          </li>
          <li>
            <strong>No Guarantee:</strong> We do not guarantee accuracy, reliability, or
            uninterrupted availability of the Services.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Limitation of Liability</h2>
        <p className="mb-4">
          To the maximum extent permitted by law, Dravmo and its affiliates shall not be liable for
          indirect, incidental, special, or consequential damages arising from your use of the
          Services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Indemnification</h2>
        <p className="mb-4">
          You agree to indemnify and hold Dravmo harmless from any claims, liabilities, damages,
          losses, and expenses arising out of your violation of these Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">13. Termination</h2>
        <p className="mb-4">
          We may suspend or terminate your access at any time for breach of these Terms or for any
          reason, without notice. Upon termination, your right to use the Services immediately
          ceases.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          14. Governing Law and Dispute Resolution
        </h2>
        <p className="mb-4">
          These Terms are governed by the laws of the State of Delaware, USA. Any disputes arising
          under or relating in any way to these Terms will be resolved exclusively in the state or
          federal courts located in Wilmington, Delaware.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">15. Severability</h2>
        <p className="mb-4">
          If any provision of these Terms is found invalid or unenforceable, the remaining
          provisions will remain in full force and effect.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">16. Contact Us</h2>
        <p className="mb-4">
          For questions or concerns regarding these Terms, please contact us at:
        </p>
        <div className="rounded-lg mb-6">
          <p className="font-semibold">Dravmo Inc. (Delaware C Corp)</p>
          <p>Virtual Mailing Address: 8 The Green, STE R, Dover, DE 19901, USA</p>
        </div>

        <p className="text-lg font-medium mt-8 mb-4">
          By using Dravmo, you acknowledge that you have read, understood, and agree to these Terms
          and Conditions.
        </p>
      </div>
      <FooterSection />
    </div>
  );
}
