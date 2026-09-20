import type { RouteRecord } from "vite-react-ssg";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import AccessPage from "./pages/AccessPage";
import LocationsPage from "./pages/LocationsPage";
import PartnersPage from "./pages/PartnersPage";
import CategoryPage from "./pages/CategoryPage";
import OfferDetailPage from "./pages/OfferDetailPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import FAQPage from "./pages/FAQPage";
import NotFound from "./pages/NotFound";
import { categoryStaticPaths, offerStaticPaths } from "./lib/routes-manifest";

const queryClient = new QueryClient();

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Outlet />
    </TooltipProvider>
  </QueryClientProvider>
);

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, Component: Index },

      // Main navigation pages
      { path: "access", Component: AccessPage },
      { path: "locations", Component: LocationsPage },
      { path: "partners", Component: PartnersPage },
      { path: "contact", Component: ContactPage },
      { path: "privacy", Component: PrivacyPage },
      { path: "terms", Component: TermsPage },
      { path: "faq", Component: FAQPage },

      // Category hubs: /private-air, /yachts, ...
      { path: ":categoryId", Component: CategoryPage, getStaticPaths: () => categoryStaticPaths() },

      // City x asset pages: /yachts/yacht-charter-miami
      { path: ":categoryId/:offerSlug", Component: OfferDetailPage, getStaticPaths: () => offerStaticPaths() },

      // Rendered to dist/404.html (served with HTTP 404 by Netlify); also the client-side catch-all.
      { path: "404", Component: NotFound },
      { path: "*", Component: NotFound },
    ],
  },
];
