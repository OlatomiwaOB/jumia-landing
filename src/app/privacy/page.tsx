import { Metadata } from "next";
import Header from "../../../fortitude-app/layout/header";
import Footer from "../../../fortitude-app/layout/footer";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy | Fortitude IoT",
  description: "Privacy Policy for Fortitude IoT digital marketplace app",
};

export default function PrivacyPolicy() {
  return (
    <>
      <Suspense>
        <Header />
        <div className="mb-30 container mx-auto py-12 px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>

          <div className="prose max-w-none">
            <p className="text-sm text-gray-500 mb-6">
              Effective Date: January 15, 2026
            </p>

            <p>
              Fortitude IoT ("we", "our", or "us") operates the Fortitude IoT App, 
              a digital marketplace that enables users to shop for goods and services, 
              access financial services, and purchase digital products.
            </p>
            <p>
              We are committed to protecting user privacy and handling personal data 
              transparently and securely. This Privacy Policy explains how Fortitude IoT 
              collects, uses, shares, and protects user data in compliance with Google 
              Play policies, the Nigeria Data Protection Act (NDPA) 2023, and other 
              applicable regulations.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-bold mt-4 mb-2">1.1 Personal Information</h3>
            <p>
              We collect personal information provided directly by users to enable 
              account creation and secure access:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Full name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Login credentials (securely encrypted)</li>
            </ul>

            <h3 className="text-xl font-bold mt-4 mb-2">1.2 Transaction Information</h3>
            <p>
              To enable financial and marketplace functionality, we collect:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Transaction amounts, dates, times, and status</li>
              <li>Transaction history and activity logs</li>
            </ul>
            <p>
              This data is required to complete transactions, provide receipts, 
              resolve disputes, and meet regulatory obligations.
            </p>

            <h3 className="text-xl font-bold mt-4 mb-2">1.3 Location Information (Sensitive Permission Disclosure)</h3>
            <p>
              Fortitude IoT may collect coarse and fine location data, only while the 
              app is in use or running in the foreground, for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Verifying customer and merchant location during deliveries</li>
              <li>Fraud prevention and transaction risk assessment</li>
              <li>Compliance with financial and regulatory requirements</li>
            </ul>
            <p>
              We do not collect location data in the background for advertising, 
              analytics unrelated to core functionality, or tracking purposes.
            </p>

            <h3 className="text-xl font-bold mt-4 mb-2">1.4 Device & Technical Information</h3>
            <p>
              We may automatically collect limited technical data required for 
              security and app functionality:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Device type (Android or iOS)</li>
              <li>Operating system and app version</li>
              <li>Device identifiers (e.g., device ID, network/SIM information)</li>
              <li>IP address and diagnostic logs</li>
            </ul>
            <p>
              This information helps us prevent fraud, detect unauthorized access, 
              and improve app reliability.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">2. How We Use Your Information</h2>
            <p>
              We use user data strictly to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Authenticate users and secure accounts</li>
              <li>Process and monitor financial transactions</li>
              <li>Verify merchant and device authenticity</li>
              <li>Send transaction alerts and service notifications</li>
              <li>Enable account updates (e.g., PIN changes)</li>
              <li>Detect, prevent, and investigate fraud or security incidents</li>
              <li>Improve app performance, stability, and security</li>
              <li>Comply with Nigerian financial, data protection, and regulatory laws</li>
            </ul>
            <p>
              We do not use personal data for targeted advertising or data resale.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">3. Data Sharing and Disclosure</h2>
            <p>
              Fortitude IoT does not sell, rent, or trade personal user data.
            </p>
            <p>
              Data may be shared only:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>With regulated financial institutions and service providers strictly for transaction processing</li>
              <li>With trusted vendors under contractual confidentiality obligations</li>
              <li>When required by law, regulation, or lawful government request</li>
              <li>To protect the rights, safety, and integrity of users, Fortitude IoT, or the public</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4">4. Data Security</h2>
            <p>
              We apply industry-standard security safeguards, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encryption of sensitive information (PINs, credentials)</li>
              <li>Secure communication protocols (HTTPS/TLS)</li>
              <li>Restricted internal access and monitoring</li>
            </ul>
            <p>
              Users are responsible for keeping their login credentials confidential.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">5. Data Retention</h2>
            <p>
              We retain personal and transaction data only for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide app services</li>
              <li>Meet legal, financial, and audit requirements</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
            <p>
              Data is securely deleted or anonymized when no longer required.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">6. User Rights and Controls</h2>
            <p>
              Subject to applicable laws, users may:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Request access to their personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of their data (where legally permissible)</li>
            </ul>
            <p>
              Requests can be submitted via the contact details below.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">7. Compliance With Nigerian Data Protection Laws</h2>
            <p>
              Fortitude IoT complies with the Nigeria Data Protection Act (NDPA) 2023 
              and regulations issued by the Nigeria Data Protection Commission (NDPC).
            </p>
            <p>
              We ensure personal data is:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Collected lawfully and transparently</li>
              <li>Used only for legitimate, disclosed purposes</li>
              <li>Protected against unauthorized access or misuse</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4">8. Children's Privacy</h2>
            <p>
              Fortitude IoT is not intended for individuals under 18 years of age. 
              We do not knowingly collect personal data from children.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">9. App Permissions Disclosure</h2>
            <p>
              Fortitude IoT requests only permissions necessary for core app functionality:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Internet & Network Access:</strong> Required to connect securely to servers and process transactions</li>
              <li><strong>Location (Coarse & Fine):</strong> Used for fraud prevention, delivery verification, and regulatory compliance</li>
              <li><strong>Camera:</strong> Used for QR code scanning and document verification</li>
              <li><strong>Phone State:</strong> Used for device verification and fraud prevention</li>
              <li><strong>Storage (Limited):</strong> Used to save transaction receipts and logs where supported</li>
              <li><strong>Bluetooth:</strong> Used for supported hardware and peripheral communication</li>
              <li><strong>Foreground Services:</strong> Ensures uninterrupted transaction processing</li>
              <li><strong>Notifications:</strong> Used to deliver transaction alerts and account updates</li>
            </ul>
            <p>
              We do not use permissions for advertising, tracking, or unauthorized 
              background data collection.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">10. Third-Party Services</h2>
            <p>
              The App integrates with third-party banks, payment processors, and 
              financial infrastructure providers required to complete transactions. 
              These providers operate under their own privacy policies.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Updates will be 
              communicated through the App or official channels. Continued use of 
              the App indicates acceptance of the revised policy.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">12. Contact Information</h2>
            <p>
              For questions or data requests, contact:
            </p>
            <p>
              <strong>Fortitude IoT Support</strong><br />
              <strong>Email:</strong> info@fortitudeiot.com<br />
              <strong>Address:</strong> 1706B Olubusi close, off Akin Adesola street via Bishop Oluwole Street, VI, Lagos state, Nigeria.<br />
              <strong>Phone:</strong> 07078553444
            </p>

            <p className="mt-8 font-medium">
              By using the Fortitude IoT App, you acknowledge and agree to this Privacy Policy.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Last updated: January 15, 2026
            </p>
          </div>
        </div>
        <Footer />
      </Suspense>
    </>
  );
}