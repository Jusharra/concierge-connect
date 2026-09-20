import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";
import { SITE_NAME } from "@/lib/constants";
import PageHead from "@/components/seo/PageHead";

const Index = () => {
  return (
    <>
      <PageHead
        title={`${SITE_NAME} | Private Access to Luxury Experiences`}
        description="Discreet access to private jets, luxury yachts, exotic cars, off-market properties, and exclusive business opportunities. Verified partners. Complete confidentiality."
        path="/"
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
