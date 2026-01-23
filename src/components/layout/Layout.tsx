import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import StickyCallButton from "../ui/StickyCallButton";
import CookieConsent from "../ui/CookieConsent";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
      <StickyCallButton />
      <CookieConsent />
    </div>
  );
};

export default Layout;
