import { Metadata } from "next";
import Header from "../../../fortitude-app/layout/header";
import Footer from "../../../fortitude-app/layout/footer";
import ContactForm from "@/components/contact/contact-form";
import ContactInfo from "@/components/contact/contact-info";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Contact Us | Fortitude Direct",
  description: "Get in touch with Fortitude Direct for support, inquiries, or partnership opportunities",
};

export default function ContactPage() {
  return (
    <>
      <Suspense>
        <Header />
        <div className="">

        </div>
        {/* Hero Section */}
        <section className="text-accent-foreground bg-gray-100 py-10">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact us</h1>
              <p className="text-xl">Get in touch with our team for support, inquiries, or partnership opportunities.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto py-12 px-4 ">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ContactForm />
              <ContactInfo />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-40 px-7 bg-gray-100">
          <div className="">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Find answers to common questions about our ecommerce platform, payment options, and account management.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept various payment methods including credit/debit cards, cryptocurrency payments, and buy now pay later options. All transactions are secure and encrypted.",
                },
                {
                  question: "How do I track my order?",
                  answer: "Once your order is shipped, you'll receive a tracking number via email. You can also check your order status in your account dashboard under 'Order History'.",
                },
                {
                  question: "Do you offer international shipping?",
                  answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on your location. Check our shipping policy for more details.",
                },
                {
                  question: "How does the buy now, pay later option work?",
                  answer: "Our buy now, pay later option allows you to split your payment into installments. You'll typically pay a portion at checkout and the remainder in scheduled payments. Specific terms depend on the payment provider.",
                },
                {
                  question: "How do I become a seller on Fortitude Direct?",
                  answer: "We welcome new sellers! Visit our 'Become a Seller' page to apply. Our team will review your application and guide you through the onboarding process.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </Suspense>
    </>
  );
}