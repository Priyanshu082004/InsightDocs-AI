import FAQItem from "./FAQItem";
import { FAQ_ITEMS } from "./faqData";

function FAQ() {
  return (
    <section id="faq" className="px-6 pb-24 pt-4">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <span
            id="faq-eyebrow"
            className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600"
          >
            FAQ
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          {FAQ_ITEMS.map((item) => (
            <FAQItem key={item.question} {...item} />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Still have questions?{" "}
          <a
            href="mailto:hello@insightdocs.ai"
            className="font-medium text-brand-600 hover:text-brand-700"
          >
            Contact us
          </a>
        </p>
      </div>
    </section>
  );
}

export default FAQ;