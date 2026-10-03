import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export interface FAQEntry {
  q: string;
  a: string;
  localityId?: string;
  localityName?: string;
}

interface FAQListProps {
  faqs: FAQEntry[];
  testIdPrefix?: string;
}

export function FAQList({ faqs, testIdPrefix = "faq" }: FAQListProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const itemValue = `${testIdPrefix}-${index}`;
        const answerId = `${testIdPrefix}-answer-${index}`;
        const triggerId = `${testIdPrefix}-trigger-${index}`;
        const isOpen = openItems.includes(itemValue);

        return (
          <div
            key={`${faq.q}-${index}`}
            className="overflow-hidden rounded-2xl border border-border"
            data-locality={faq.localityId}
          >
            <button
              type="button"
              id={triggerId}
              className="flex w-full cursor-pointer items-center justify-between px-5 py-5 text-left font-semibold text-foreground no-underline hover:bg-accent/30 hover:no-underline"
              aria-expanded={isOpen}
              aria-controls={answerId}
              data-testid={`${testIdPrefix}-trigger-${index}`}
              onClick={() => {
                if (!isOpen) {
                  trackEvent("faq_open", {
                    route: typeof window === "undefined" ? "/" : window.location.pathname,
                    faq_group: testIdPrefix.replace(/-faq$/, ""),
                    question_index: index,
                    is_locality: Boolean(faq.localityId),
                  });
                }
                setOpenItems((current) =>
                  isOpen
                    ? current.filter((value) => value !== itemValue)
                    : [...current, itemValue],
                );
              }}
            >
              <span className="flex min-w-0 items-center gap-3">
                {faq.localityName && (
                  <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-muted-foreground">
                    Area · {faq.localityName}
                  </span>
                )}
                <span>{faq.q}</span>
              </span>
              <ChevronDown
                aria-hidden="true"
                className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              id={answerId}
              role="region"
              aria-labelledby={triggerId}
              className="border-t border-border px-5 pt-4 pb-5 text-muted-foreground leading-relaxed"
              data-testid={`${testIdPrefix}-content-${index}`}
              hidden={!isOpen}
            >
              {faq.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}