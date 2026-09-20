import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Crumb } from "@/lib/seo-templates";

/** Visible breadcrumb trail. The matching BreadcrumbList JSON-LD is emitted by the page via PageHead. */
const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
  <nav aria-label="Breadcrumb" className="mb-6">
    <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <li key={c.path} className="flex items-center gap-2">
            {last ? (
              <span aria-current="page" className="text-foreground">
                {c.name}
              </span>
            ) : (
              <>
                <Link to={c.path} className="hover:text-primary transition-colors">
                  {c.name}
                </Link>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumbs;
