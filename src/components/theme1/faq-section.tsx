import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How do I make a purchase on your site?",
      answer: "Simply browse our products, add items to your cart, and proceed to checkout. We accept all major credit cards and secure payment methods.",
    },
    {
      question: "What products are available for same-day delivery?",
      answer: "Products marked with the same-day delivery badge are available for immediate shipping if ordered before 2 PM in your timezone.",
    },
    {
      question: "Where is my tracking number?",
      answer: "Your tracking number will be sent to your email within 24 hours of your order being shipped. You can also find it in your account order history.",
    },
    {
      question: "What are the service centers that repair the products on-site?",
      answer: "We have authorized service centers in all major cities. Visit our Service Centers page to find the nearest location to you.",
    },
    {
      question: "How much does delivery cost & what method of payment is required?",
      answer: "Delivery costs vary by location and order size. We offer free shipping on orders over $50. We accept credit cards, PayPal, and other secure payment methods.",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">FREQUENTLY ASKED QUESTIONS</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
