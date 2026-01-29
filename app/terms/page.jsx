// app/terms/page.jsx
import Layout from '@/components/layout/Layout'
import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using AlimsWrite academic writing services.',
}

export default function TermsPage() {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Terms of Service
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
                Welcome to AlimsWrite. These Terms of Service (&quot;Terms&quot;) govern your use of our 
                website located at alimswrite.com and our academic writing services. By accessing 
                or using our services, you agree to be bound by these Terms. If you disagree with 
                any part of these terms, you may not access our services.
              </p>

              <h2>2. Description of Services</h2>
              <p>
                AlimsWrite provides academic writing assistance, research support, and related 
                educational services including but not limited to:
              </p>
              <ul>
                <li>Project writing and research assistance</li>
                <li>Thesis and dissertation support</li>
                <li>Data analysis services</li>
                <li>Editing, proofreading, and paraphrasing</li>
                <li>Research proposal writing</li>
                <li>Assignment writing assistance</li>
                <li>CV and statement of purpose writing</li>
              </ul>
              <p>
                Our services are intended to serve as educational tools, research aids, and 
                reference materials to assist students in their academic work.
              </p>

              <h2>3. Acceptable Use</h2>
              <p>
                By using our services, you agree that:
              </p>
              <ul>
                <li>
                  You will use the materials provided as reference, research aid, or learning 
                  resource in accordance with your institution&apos;s academic integrity policies.
                </li>
                <li>
                  You are responsible for ensuring that your use of our services complies with 
                  your institution&apos;s guidelines and regulations.
                </li>
                <li>
                  You will not misrepresent the materials as entirely your own original work 
                  if your institution&apos;s policies prohibit such use.
                </li>
                <li>
                  You will provide accurate and complete information when placing orders.
                </li>
              </ul>

              <h2>4. Order Process</h2>
              <p>
                When you place an order with AlimsWrite:
              </p>
              <ul>
                <li>
                  You must provide clear and complete project requirements, including topic, 
                  deadline, academic level, and any specific instructions.
                </li>
                <li>
                  We will provide a quote based on your requirements. Prices may vary based 
                  on complexity, length, and urgency.
                </li>
                <li>
                  Orders are confirmed upon payment. We reserve the right to decline orders 
                  that we cannot fulfill satisfactorily.
                </li>
                <li>
                  You are responsible for reviewing the delivered work and requesting any 
                  necessary revisions within the specified revision period.
                </li>
              </ul>

              <h2>5. Payment Terms</h2>
              <p>
                Payment terms are as follows:
              </p>
              <ul>
                <li>
                  All prices are quoted in Nigerian Naira (NGN) unless otherwise specified.
                </li>
                <li>
                  Payment must be made through approved channels as communicated during the 
                  order process.
                </li>
                <li>
                  For larger projects, partial payment may be required upfront with the 
                  balance due upon delivery.
                </li>
                <li>
                  Prices quoted are valid for 48 hours unless otherwise stated.
                </li>
              </ul>

              <h2>6. Delivery and Revisions</h2>
              <p>
                Regarding delivery of completed work:
              </p>
              <ul>
                <li>
                  We commit to delivering work within the agreed deadline. Delays caused by 
                  factors beyond our control may extend delivery times.
                </li>
                <li>
                  Completed work is delivered via email and/or WhatsApp in the agreed format.
                </li>
                <li>
                  We offer free revisions based on supervisor feedback, provided the revision 
                  request is within the original scope of the project.
                </li>
                <li>
                  Revision requests that significantly alter the original requirements may 
                  incur additional charges.
                </li>
              </ul>

              <h2>7. Refund Policy</h2>
              <p>
                Our refund policy is as follows:
              </p>
              <ul>
                <li>
                  We prioritize revisions over refunds. If you are not satisfied, we will 
                  work with you to address concerns.
                </li>
                <li>
                  Refunds may be considered on a case-by-case basis if we fail to deliver 
                  the agreed service despite reasonable revision attempts.
                </li>
                <li>
                  Refund requests must be made within 14 days of delivery.
                </li>
                <li>
                  No refunds will be issued for work that has been approved or used by the client.
                </li>
              </ul>

              <h2>8. Intellectual Property</h2>
              <p>
                Upon full payment:
              </p>
              <ul>
                <li>
                  You receive full rights to use the delivered materials for your personal 
                  academic purposes.
                </li>
                <li>
                  We do not retain copies of delivered work or resell completed projects.
                </li>
                <li>
                  Content on our website (excluding delivered custom work) remains our 
                  intellectual property.
                </li>
              </ul>

              <h2>9. Confidentiality</h2>
              <p>
                We are committed to protecting your privacy:
              </p>
              <ul>
                <li>
                  All personal information and project details are kept strictly confidential.
                </li>
                <li>
                  We do not share client information with third parties except as necessary 
                  to provide our services.
                </li>
                <li>
                  Please refer to our Privacy Policy for detailed information on data handling.
                </li>
              </ul>

              <h2>10. Limitation of Liability</h2>
              <p>
                AlimsWrite shall not be liable for:
              </p>
              <ul>
                <li>
                  Any indirect, incidental, or consequential damages arising from the use 
                  of our services.
                </li>
                <li>
                  Academic outcomes, grades, or institutional decisions related to work 
                  produced with our assistance.
                </li>
                <li>
                  Delays or failures caused by circumstances beyond our reasonable control.
                </li>
              </ul>
              <p>
                Our total liability for any claim shall not exceed the amount paid for the 
                specific service in question.
              </p>

              <h2>11. Disclaimer</h2>
              <p>
                Our services are provided &quot;as is&quot; without warranties of any kind, either 
                express or implied. We do not guarantee specific grades or academic outcomes. 
                The quality of our work meets professional academic writing standards, but 
                final evaluation remains at the discretion of your institution.
              </p>

              <h2>12. Termination</h2>
              <p>
                We reserve the right to refuse service or terminate relationships with 
                clients who:
              </p>
              <ul>
                <li>Violate these Terms of Service</li>
                <li>Engage in abusive or fraudulent behavior</li>
                <li>Fail to make agreed payments</li>
                <li>Provide false information</li>
              </ul>

              <h2>13. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be 
                posted on this page with an updated revision date. Continued use of our 
                services after changes constitutes acceptance of the modified Terms.
              </p>

              <h2>14. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws 
                of the Federal Republic of Nigeria, without regard to its conflict of law 
                provisions.
              </p>

              <h2>15. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul>
                <li>WhatsApp: 09039611238</li>
                <li>Email: contact@alimswrite.com</li>
              </ul>

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
