import type { Faq } from "../../../shared/data-types";

/**
 * Native <details> so every answer is in the pre-rendered HTML (crawlers and view-source see the
 * text) while still collapsing for visitors.
 */
const FaqList = ({ faqs }: { faqs: Faq[] }) => (
  <div className="divide-y divide-border/50 rounded-lg border border-border/50 bg-muted/20">
    {faqs.map((f) => (
      <details key={f.q} className="group px-5 py-4">
        <summary className="cursor-pointer list-none font-medium text-foreground flex items-center justify-between gap-4">
          <span>{f.q}</span>
          <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
      </details>
    ))}
  </div>
);

export default FaqList;
