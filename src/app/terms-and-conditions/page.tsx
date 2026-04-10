import { Metadata } from "next";
import Header from "../../../fortitude-app/layout/header";
import Footer from "../../../fortitude-app/layout/footer";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Terms and Conditions | Fortitude Direct",
  description: "Terms and Conditions for Fortitude Direct digital marketplace platform",
};

export default function TermsConditions() {
  return (
    <>
      <Suspense>
        <Header />
        <div className="mb-30 container mx-auto py-12 px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>

          <div className="prose max-w-none">
            <p className="text-sm text-gray-500 mb-6">
              Effective Date: September 1, 2025
            </p>

            <p>
              These Terms and Conditions govern your use of our website{" "}
              <a href="https://fortitudeiot.com/" className="text-blue-600 hover:underline">
                https://fortitudeiot.com/
              </a>{" "}
              and the purchase of products from us. By using our site, you agree to these terms.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">1. Use of Website</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>
                You must be at least 18 years old to use this site, and by agreeing to these 
                terms and conditions you represent that you are at least 18 years old.
              </li>
              <li>
                You agree not to use the website for any illegal, unlawful, fraudulent or 
                prohibited purpose.
              </li>
              <li>
                We reserve the right to suspend or terminate your access to the website if you 
                breach these Terms or use the website in a manner we reasonably consider unlawful 
                or harmful.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4">2. Product Information</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>
                We strive to ensure product descriptions and pricing are accurate. However, errors 
                may occur, and to the extent permitted by law, we accept no liability for such errors.
              </li>
              <li>
                We reserve the right to correct any errors and cancel orders if we deem it necessary.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4">3. Orders and Payments</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>All orders are subject to our acceptance and availability.</li>
              <li>
                Payment for each order must be made in full before the dispatch of the 
                corresponding order.
              </li>
              <li>
                We use secure third-party payment processors and do not store your payment card 
                details.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4">4. Shipping and Delivery</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Delivery times are estimates and may vary.</li>
              <li>
                We are not responsible for and accept no liability for delays outside our control 
                (e.g., customs, courier issues).
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4">5. Returns and Refunds</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Our return and refund policy is available at{" "}
                <a href="https://fortitudeiot.com/" className="text-blue-600 hover:underline">
                  https://fortitudeiot.com/
                </a>{" "}
                and forms part of these Terms and Conditions.
              </li>
              <li>
                To be eligible for return, items must be unused, untampered with, and in original 
                packaging, subject to the conditions set out in our return policy.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4">6. Intellectual Property</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>
                All intellectual property rights to the content on this website (images, text, logos, 
                software, and the Fortitude Direct platform) are owned in their entirety by 
                Fortitude IoT Limited or its licensees.
              </li>
              <li>
                You may not copy, reproduce, or use our content without our express and prior 
                written consent.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4">7. Limitation of Liability</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>
                To the maximum extent permitted by applicable law, we do not accept any liability, 
                whatsoever, for any indirect, incidental, special or consequential damages that may 
                arise as a result of your use of this website.
              </li>
              <li>
                Our total liability for any claim, whether in contract, tort, or otherwise, shall 
                not exceed the amount paid by you for the relevant product giving rise to the claim.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4">8. Governing Law and Dispute Resolution</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>
                These Terms shall be governed by and construed in accordance with the laws of the 
                Federal Republic of Nigeria.
              </li>
              <li>
                In the event of any dispute, controversy, or claim arising out of or in connection 
                with these Terms or your use of the website, the parties shall first attempt to 
                resolve the dispute amicably through good-faith negotiations.
              </li>
              <li>
                A party intending to commence any formal proceedings shall give the other party at 
                least fourteen (14) days’ written notice of the dispute (a “Pre-Action Notice”), 
                clearly setting out the nature of the dispute and the relief sought.
              </li>
              <li>
                Where the dispute is not resolved within fourteen (14) days of receipt of the 
                Pre-Action Notice, the parties may refer the dispute to mediation at a mutually 
                agreed mediation centre in Nigeria.
              </li>
              <li>
                Nothing in this clause shall prevent either party from seeking urgent interim or 
                injunctive relief from a court of competent jurisdiction where necessary.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4">9. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time as we deem necessary. Your continued use 
              of the website indicates your acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">10. Privacy and Data Protection</h2>
            <p>
              Your use of this website is also subject to our{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              , which explains how we collect, use, store, and protect your personal data in 
              accordance with applicable Nigerian data protection laws and regulations.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4">11. Contact Us</h2>
            <p>
              If you have questions about these Terms, contact us at:
            </p>
            <p>
              <strong>Fortitude Direct Support</strong><br />
              <strong>Email:</strong> info@fortitudeiot.com<br />
              <strong>Phone:</strong> 07078553444<br />
              <strong>Address:</strong> 1706B Olubosi close, off Akin Adesola street via Bishop 
              Oluwole Street, Victoria Island, Lagos State, Nigeria.
            </p>

            <p className="mt-8 font-medium">
              By using the Fortitude Direct website, you acknowledge and agree to these Terms and Conditions.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Last updated: September 1, 2025
            </p>
          </div>
        </div>
        <Footer />
      </Suspense>
    </>
  );
}