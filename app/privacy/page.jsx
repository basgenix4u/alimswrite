// app/privacy/page.jsx
import Layout from '@/components/layout/Layout'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for AlimsWrite - how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-primary-200">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
            <div className="prose prose-lg max-w-none">
              
              <h2>1. Introduction</h2>
              <p>
                AlimsWrite (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard 
                your information when you use our website and services. Please read this 
                policy carefully. By using our services, you consent to the practices 
                described in this policy.
              </p>

              <h2>2. Information We Collect</h2>
              
              <h3>2.1 Personal Information</h3>
              <p>
                We may collect personal information that you voluntarily provide to us, including:
              </p>
              <ul>
                <li>Name and contact information (email address, phone number, WhatsApp number)</li>
                <li>Academic information (university, department, academic level)</li>
                <li>Project details and requirements</li>
                <li>Communication history with our team</li>
                <li>Payment information (processed securely through banking channels)</li>
              </ul>

              <h3>2.2 Automatically Collected Information</h3>
              <p>
                When you visit our website, we may automatically collect certain information:
              </p>
              <ul>
                <li>Device information (browser type, operating system)</li>
                <li>IP address and approximate location</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referring website or source</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>
                We use the information we collect for the following purposes:
              </p>
              <ul>
                <li>
                  <strong>Service Delivery:</strong> To process orders, assign writers, 
                  and deliver completed work.
                </li>
                <li>
                  <strong>Communication:</strong> To respond to inquiries, provide updates 
                  on orders, and address concerns.
                </li>
                <li>
                  <strong>Service Improvement:</strong> To understand how our services 
                  are used and improve user experience.
                </li>
                <li>
                  <strong>Marketing:</strong> To send promotional communications (with 
                  your consent) about our services.
                </li>
                <li>
                  <strong>Legal Compliance:</strong> To comply with applicable laws, 
                  regulations, and legal processes.
                </li>
              </ul>

              <h2>4. Information Sharing and Disclosure</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information only in the following circumstances:
              </p>
              <ul>
                <li>
                  <strong>Service Providers:</strong> With trusted team members and 
                  writers who need access to fulfill your order, bound by confidentiality 
                  obligations.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law, court order, 
                  or governmental regulation.
                </li>
                <li>
                  <strong>Protection of Rights:</strong> To protect our rights, privacy, 
                  safety, or property, or that of our users or others.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with any merger, sale, 
                  or transfer of business assets (with continued protection of your data).
                </li>
              </ul>

              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect 
                your personal information, including:
              </p>
              <ul>
                <li>Secure communication channels for sensitive information</li>
                <li>Limited access to personal data on a need-to-know basis</li>
                <li>Regular review of our data collection and storage practices</li>
                <li>Confidentiality agreements with team members who handle data</li>
              </ul>
              <p>
                However, no method of transmission over the Internet or electronic storage 
                is 100% secure. While we strive to protect your information, we cannot 
                guarantee absolute security.
              </p>

              <h2>6. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to:
              </p>
              <ul>
                <li>Provide our services and fulfill orders</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Maintain records for business purposes</li>
              </ul>
              <p>
                Project files are typically retained for a limited period after delivery 
                to facilitate revisions. After this period, files may be securely deleted 
                from our systems.
              </p>

              <h2>7. Cookies and Tracking Technologies</h2>
              <p>
                Our website may use cookies and similar tracking technologies to:
              </p>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our website</li>
                <li>Improve website functionality and performance</li>
                <li>Provide personalized content and recommendations</li>
              </ul>
              <p>
                You can control cookies through your browser settings. Disabling cookies 
                may affect some features of our website.
              </p>

              <h2>8. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites or services (such as 
                WhatsApp, social media platforms). We are not responsible for the privacy 
                practices of these third parties. We encourage you to review their privacy 
                policies before providing any personal information.
              </p>

              <h2>9. Children&apos;s Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of 16. We do 
                not knowingly collect personal information from children. If you believe 
                we have inadvertently collected information from a child, please contact 
                us immediately.
              </p>

              <h2>10. Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your 
                personal information:
              </p>
              <ul>
                <li>
                  <strong>Access:</strong> Request a copy of the personal information 
                  we hold about you.
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate or 
                  incomplete information.
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal information, 
                  subject to legal retention requirements.
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing communications at 
                  any time.
                </li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided below.
              </p>

              <h2>11. International Data Transfers</h2>
              <p>
                Our services are primarily operated in Nigeria. If you access our services 
                from outside Nigeria, please be aware that your information may be transferred 
                to, stored, and processed in Nigeria where our servers are located.
              </p>

              <h2>12. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in 
                our practices or for legal, operational, or regulatory reasons. We will 
                post the updated policy on this page with a revised &quot;Last updated&quot; date. 
                We encourage you to review this policy periodically.
              </p>

              <h2>13. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy 
                Policy or our data practices, please contact us:
              </p>
              <ul>
                <li>WhatsApp: 09039611238</li>
                <li>Email: contact@alimswrite.com</li>
              </ul>
              <p>
                We will respond to your inquiry within a reasonable timeframe.
              </p>

              <h2>14. Consent</h2>
              <p>
                By using our website and services, you consent to the collection, use, 
                and disclosure of your information as described in this Privacy Policy.
              </p>

            </div>

            {/* Back Link */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <Link 
                href="/" 
                className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
