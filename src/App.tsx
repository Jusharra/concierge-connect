import type { RouteRecord } from "vite-react-ssg";
import { Outlet, useParams } from "react-router-dom";
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
import Analytics from "./components/seo/Analytics";
import AssetHubPage from "./pages/AssetHubPage";
import QuotePage from "./pages/QuotePage";
import ThankYouPage from "./pages/ThankYouPage";
import PackagePage from "./pages/PackagePage";
import { assetHubStaticPaths, categoryStaticPaths, offerStaticPaths, packageStaticPaths } from "./lib/routes-manifest";
import { findPackage } from "./lib/catalog";

const queryClient = new QueryClient();

const PackageRoute = () => {
  const { categoryId, offerSlug, packageSlug } = useParams();
  const found = categoryId && offerSlug && packageSlug ? findPackage(categoryId, offerSlug, packageSlug) : undefined;
  return found ? <PackagePage offer={found.offer} pkg={found.pkg} /> : <NotFound />;
};

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Analytics />
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
      { path: "quote", Component: QuotePage },
      { path: "thank-you", Component: ThankYouPage },

      // Asset hubs: /services/yacht-charter/ (only while a city page for the asset is published)
      { path: "services/:assetSlug", Component: AssetHubPage, getStaticPaths: () => assetHubStaticPaths() },

      // Category hubs: /private-air, /yachts, ...
      { path: ":categoryId", Component: CategoryPage, getStaticPaths: () => categoryStaticPaths() },

      // City x asset pages: /yachts/yacht-charter-miami
      { path: ":categoryId/:offerSlug", Component: OfferDetailPage, getStaticPaths: () => offerStaticPaths() },

      // Package pages: /yachts/yacht-charter-los-angeles/catalina-weekend
      { path: ":categoryId/:offerSlug/:packageSlug", Component: PackageRoute, getStaticPaths: () => packageStaticPaths() },

      // Rendered to dist/404.html (served with HTTP 404 by Netlify); also the client-side catch-all.
      { path: "404", Component: NotFound },
      { path: "*", Component: NotFound },
    ],
  },
];
