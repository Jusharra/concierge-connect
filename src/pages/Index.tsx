import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";
import { SITE_NAME } from "@/lib/constants";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>{SITE_NAME} | Private Access to Luxury Experiences</title>
        <meta 
          name="description" 
          content="Discreet access to private jets, luxury yachts, exotic cars, off-market properties, and exclusive business opportunities. Verified partners. Complete confidentiality." 
        />
        <meta property="og:title" content={`${SITE_NAME} | Private Access to Luxury Experiences`} />
        <meta property="og:description" content="Discreet access to private jets, luxury yachts, exotic cars, off-market properties, and exclusive business opportunities." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/" />
      </Helmet>

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
