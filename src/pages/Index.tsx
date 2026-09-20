import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";
import { homeTitle, organizationLd } from "@/lib/seo-templates";
import PageHead from "@/components/seo/PageHead";

const Index = () => {
  return (
    <>
      <PageHead
        title={homeTitle()}
        description="Book private jets, luxury yachts and exotic cars with transparent starting prices. Reserve with a deposit or request a quote. Verified operators."
        path="/"
        jsonLd={organizationLd()}
      />

      <Layout>
        <HeroSection />
        <CategoriesSection />
        <HowItWorksSection />
        <CTASection />
      </Layout>
    </>
  );
};

export default Index;
