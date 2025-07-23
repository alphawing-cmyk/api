import FooterCustom from "~/components/common/FooterCustom";
import Navbar from "~/components/features/home/components/Navbar";

export default function Privacy() {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-[100px]">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Introduction
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                At Alpha Wing, we take your privacy seriously. This policy
                explains how we collect, use, and protect your personal and
                trading data when you use our algorithmic trading platform.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Data We Collect
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  <strong>Account Information:</strong> Name, email, contact
                  details
                </li>
                <li>
                  <strong>Trading Data:</strong> Strategies, execution logs,
                  performance metrics
                </li>
                <li>
                  <strong>Technical Data:</strong> IP addresses, device
                  information, usage patterns
                </li>
                <li>
                  <strong>Payment Information:</strong> Encrypted billing
                  details (processed by our PCI-compliant provider)
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                How We Use Your Data
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Platform Operation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Execute trades, optimize strategies, and maintain your
                    account
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Security & Compliance
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Fraud prevention, regulatory requirements, and system
                    integrity
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                    Service Improvement
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Enhance platform features and develop new tools
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Communication
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Send important updates and respond to inquiries
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Data Protection
              </h2>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "We implement high security measures including strong
                  encryption methods, multi-factor authentication, and stringent application 
                  deployment measures."
                </p>
              </div>
              <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  All API keys and credentials are encrypted at rest and in
                  transit.
                </p>
                <p>
                  Our infrastructure undergoes penetration testing by
                  independent security firms.
                </p>
                <p>
                  Employees undergo rigorous background checks and access is
                  strictly role-based.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Your Rights
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  You may request access, correction, or deletion of your
                  personal data.
                </p>
                <p>Opt out of marketing communications at any time.</p>
                <p>
                  Request export of your trading strategy data in
                  machine-readable format.
                </p>
                <p>Withdraw consent where processing is based on consent.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                For privacy-related inquiries, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-medium">alphawing.tech@gmail.com</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We typically respond within 24-48 hours.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <FooterCustom />
    </>
  );
}
