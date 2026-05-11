import Link from "next/link";

export const metadata = { title: "Terms of Use | Panch Tara Jame Masjid" };

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-[#f9f6f0] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-[#1a7a4a] hover:underline mb-6 inline-block">← Back to Home</Link>
        <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Terms of Use</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: June 2025</p>

        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">1. Acceptance of Terms</h2>
            <p>By accessing and using the Panch Tara Jame Masjid website, you agree to be bound by these Terms of Use. If you do not agree, please refrain from using this website.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">2. Purpose of the Website</h2>
            <p>This website is operated by Panch Tara Jame Masjid to provide information about our services, events, courses, and to facilitate donations and community engagement. It is intended for lawful, non-commercial use by the community.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">3. Acceptable Use</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>You must not use this website for any unlawful or harmful purpose.</li>
              <li>You must not post or transmit any content that is offensive, defamatory, or contrary to Islamic values and community standards.</li>
              <li>You must not attempt to gain unauthorised access to any part of the website or its systems.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">4. Donations</h2>
            <p>All donations made through this website are voluntary and intended solely for the maintenance, development, and charitable activities of Panch Tara Jame Masjid. Donations are non-refundable unless an error has occurred.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">5. Intellectual Property</h2>
            <p>All content on this website, including text, images, and logos, is the property of Panch Tara Jame Masjid or its content suppliers. You may not reproduce or distribute any content without prior written permission.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">6. Disclaimer</h2>
            <p>The information on this website is provided in good faith for general informational purposes. We make no warranties regarding the accuracy or completeness of the content and are not liable for any loss arising from reliance on it.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">7. Changes to Terms</h2>
            <p>We reserve the right to update these Terms of Use at any time. Continued use of the website after changes constitutes acceptance of the revised terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">8. Contact Us</h2>
            <p>For any questions regarding these terms, please reach out via the <Link href="/contact" className="text-[#1a7a4a] hover:underline">Contact page</Link>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
