import { DashboardLayout } from "@/components/dashboard-layout"

export default function PrivacyPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold mb-8">Dravmo Privacy Statement</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: July 23, 2025</p>

          <p className="mb-6">
            At Dravmo, Inc. (a Delaware C Corporation), we take your privacy seriously—so seriously that our AI
            sometimes double-checks our data-handling jokes for compliance. This Privacy Statement explains what
            personal information we collect, why we collect it, how we use and protect it, and your choices regarding
            your data. Please read it carefully.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">1.1 Account Information</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Registration Data:</strong> Name, email address, username, password (hashed and stored securely).
            </li>
            <li>
              <strong>Profile Details:</strong> Optional details you provide (e.g., job title, design specialties).
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">1.2 Usage Data</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Analytics:</strong> Pages visited, features used, time spent, clicks, error logs.
            </li>
            <li>
              <strong>AI Interaction Data:</strong> Content submitted for AI analysis, feedback history.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">1.3 Device & Connection Data</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Technical Data:</strong> IP address, device type, operating system, browser type and version,
              screen resolution, language settings.
            </li>
            <li>
              <strong>Network Data:</strong> ISP, connection speed, geolocation (city-level).
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">1.4 Cookies and Similar Technologies</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Cookies:</strong> Session cookies to maintain login, preference cookies for UI settings, analytics
              cookies to improve our Services.
            </li>
            <li>
              <strong>Local Storage & Pixels:</strong> For performance optimization and measuring feature engagement.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Service Delivery:</strong> To authenticate users, manage accounts, and provide core functionality.
            </li>
            <li>
              <strong>AI Model Training:</strong> To train and improve our AI-driven design feedback engine—your
              personal data is anonymized and aggregated whenever possible.
            </li>
            <li>
              <strong>Service Improvement:</strong> Analyze usage patterns to fix bugs, optimize performance, and roll
              out new features.
            </li>
            <li>
              <strong>Personalization:</strong> Recommend relevant tutorials, templates, or Dravmo tips based on your
              design preferences.
            </li>
            <li>
              <strong>Communication:</strong> Send you transactional emails (e.g., password resets) and, with your
              consent, newsletters and product updates.
            </li>
            <li>
              <strong>Legal Compliance:</strong> Comply with applicable laws, regulations, and legal processes.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Share and Disclose Information</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Service Providers:</strong> We share only the data necessary with trusted vendors (e.g., hosting,
              analytics, email delivery) under confidentiality obligations.
            </li>
            <li>
              <strong>Business Transfers:</strong> If Dravmo merges, is acquired, or undergoes asset sale, user data may
              be transferred to the successor entity—rest assured, privacy obligations travel with the data.
            </li>
            <li>
              <strong>Legal Obligations:</strong> We may disclose personal data in response to lawful requests by public
              authorities or to protect Dravmo's rights, safety, or property.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Retention</h2>
          <p className="mb-4">
            We retain personal data only as long as necessary to provide the Services, comply with legal obligations,
            resolve disputes, and enforce our policies. Usage data and AI interaction logs may be retained for up to 3
            years, anonymized thereafter.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Privacy Rights</h2>
          <p className="mb-4">Depending on your jurisdiction, you may have rights to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Access:</strong> Request a copy of your personal data.
            </li>
            <li>
              <strong>Correction:</strong> Ask to update inaccurate or incomplete information.
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your personal data, subject to legal exceptions.
            </li>
            <li>
              <strong>Portability:</strong> Receive your data in a machine-readable format.
            </li>
            <li>
              <strong>Objection:</strong> Object to certain processing activities, including targeted marketing.
            </li>
          </ul>
          <p className="mb-4">
            To exercise these rights, email us at{" "}
            <a href="mailto:privacy@dravmo.com" className="text-blue-600 hover:underline">
              privacy@dravmo.com
            </a>{" "}
            with "Privacy Request" in the subject line.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Children's Privacy</h2>
          <p className="mb-4">
            Dravmo's Services are intended for users aged 18 and over. We do not knowingly collect personal information
            from minors under 18. If you believe we have inadvertently collected data from a minor, contact us
            immediately.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. International Data Transfers</h2>
          <p className="mb-4">
            Your data may be stored and processed in the United States. By using Dravmo, you consent to transfer of your
            data to countries that may have different data protection laws than your jurisdiction.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Security Measures</h2>
          <p className="mb-4">
            We implement reasonable administrative, technical, and physical safeguards to protect your information.
            These include encryption in transit (TLS), encrypted disk storage, regular security audits, and access
            controls. However, no system is 100% secure; please use unique, strong passwords and enable two-factor
            authentication.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Cookies & Tracking Controls</h2>
          <p className="mb-4">
            Most browsers allow you to control cookies via settings preferences. You can block or delete cookies, though
            blocking essential cookies may affect functionality. For more info, visit{" "}
            <a
              href="https://aboutcookies.org"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              aboutcookies.org
            </a>
            .
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Privacy Statement</h2>
          <p className="mb-4">
            We may update this Privacy Statement to reflect changes in our practices or for legal reasons. We'll post
            the revised statement here with a new "Last updated" date. Continued use after changes implies acceptance.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
          <p className="mb-4">Questions, concerns, or requests regarding your privacy? Reach out to:</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="font-semibold">Dravmo Inc.</p>
            <p>Virtual Mailing Address: 8 The Green, STE R, Dover, DE 19901, USA</p>
          </div>

          <p className="text-center text-lg font-medium mt-8 mb-4">
            Thank you for trusting Dravmo with your design journey - our AI might be smart, but you're the real genius!
            🎨✨
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
