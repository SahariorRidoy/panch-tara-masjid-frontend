import Link from "next/link";

export const metadata = { title: "Privacy Policy | Panch Tara Jame Masjid" };

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f9f6f0] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-[#1a7a4a] hover:underline mb-6 inline-block">← Back to Home</Link>
        <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: June 2025</p>

        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">1. Introduction</h2>
            <p>Panch Tara Jame Masjid (&quot;we&quot;, &quot;our&quot;, or &quot;the Masjid&quot;) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard information when you visit our website or interact with our services.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Contact details (name, email, phone) when you submit a contact form or register for courses or events.</li>
              <li>Donation information processed securely through our payment partners.</li>
              <li>Usage data such as pages visited, collected anonymously for improving the website.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To respond to your enquiries and provide requested services.</li>
              <li>To send updates about events, courses, and Masjid announcements (only with your consent).</li>
              <li>To process donations and issue receipts.</li>
              <li>To improve our website and services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">4. Data Sharing</h2>
            <p>We do not sell or rent your personal information to third parties. We may share data with trusted service providers (e.g. payment processors) solely to operate our services, under strict confidentiality agreements.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">5. Data Security</h2>
            <p>We take reasonable technical and organisational measures to protect your information from unauthorised access, loss, or misuse.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">6. Your Rights</h2>
            <p>You have the right to access, correct, or request deletion of your personal data. To exercise these rights, please contact us at the details below.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">7. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us via the <Link href="/contact" className="text-[#1a7a4a] hover:underline">Contact page</Link>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
