import { clientConfig } from '@/config/client-config';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I place an order?",
    answer: "Choose your meal from the menu, select your portion/size, and click “Add to Cart.” Then proceed to checkout to confirm your order."
  },
  {
    question: "Do you offer delivery?",
    answer: "Yes, we deliver to all areas in the UK. Delivery charges will be shown at checkout."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept card payment and bank transfers, more details are on the checkout page."
  },
  {
    question: "What happens if my order arrives incorrect or late?",
    answer: "If there’s any issue with your order, contact us immediately and we’ll fix it or offer a replacement/refund based on the situation."
  },
  {
    question: "Do you offer catering for events?",
    answer: "Yes once your order is confirmed, you'll receive updates and estimated delivery time. Our team may also call to confirm your address and status."
  },

];

export default function FaqSection() {
  const envBgColor = clientConfig().branding.colors.accentForeground;
  const bgColor = envBgColor ? (envBgColor.startsWith('#') ? envBgColor : `#${envBgColor}`) : '#FAF9F6';

  const envTextColor = clientConfig().branding.colors.accent;
  const textColor = envTextColor ? (envTextColor.startsWith('#') ? envTextColor : `#${envTextColor}`) : '#222222';

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 w-full" style={{ backgroundColor: bgColor }}>
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 lg:gap-32">
        {/* Left Column */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <h2 
            className="text-6xl md:text-7xl lg:text-8xl font-serif tracking-tight"
            style={{ color: textColor }}
          >
            FAQ
          </h2>
          <div className="flex flex-col gap-4 text-[#888888] text-base leading-relaxed max-w-[280px]">
            <p>Got questions? We've got answers.</p>
            <p>Here are some common questions customers ask before ordering.</p>
            <p>If you need more help, feel free to contact us - we're happy to assist!</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-2/3">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-[#EAEAEA] py-2 last:border-b-0"
              >
                <AccordionTrigger 
                  className="hover:no-underline font-serif text-lg py-4 transition-opacity hover:opacity-80"
                  style={{ color: textColor }}
                >
                  <div className="flex items-center gap-6 text-left">
                    <span className="text-[#B0B0B0] text-xs font-sans w-4 font-semibold">
                      {index + 1}.
                    </span>
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-[#666666] font-sans pl-10 text-base pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
