import { Mail, MapPin, Phone } from "lucide-react";
import type { Nap } from "@/lib/seo-templates";

/**
 * Name / address / phone exactly as on the Google Business Profile listing. Values come from the
 * matching GBP Listings row (or src/config/site.ts), never typed into the page.
 */
const NapBlock = ({ nap }: { nap: Nap }) => (
  <address className="not-italic space-y-2 text-muted-foreground">
    <p className="font-semibold text-foreground">{nap.name}</p>
    {nap.address && (
      <p className="flex items-start gap-2">
        <MapPin className="w-4 h-4 mt-1 text-primary flex-shrink-0" aria-hidden="true" />
        <span>{nap.address}</span>
      </p>
    )}
    <p className="flex items-center gap-2">
      <Phone className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
      <a href={nap.phoneHref} className="text-primary hover:text-primary/80">
        {nap.phoneDisplay}
      </a>
    </p>
    <p className="flex items-center gap-2">
      <Mail className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
      <a href={`mailto:${nap.email}`} className="text-primary hover:text-primary/80">
        {nap.email}
      </a>
    </p>
  </address>
);

export default NapBlock;
