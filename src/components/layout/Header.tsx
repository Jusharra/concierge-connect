import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_NAME, PHONE_NUMBER, PHONE_HREF, CATEGORIES } from "@/lib/constants";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    ...CATEGORIES.map(cat => ({ name: cat.name, href: cat.href })),
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container-luxury">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-serif font-semibold text-foreground tracking-tight">
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium tracking-wide transition-colors link-underline ${
                  location.pathname.startsWith(link.href)
                    ? "text-gold"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={PHONE_HREF}
              className="flex items-center gap-2 text-sm font-medium text-gold hover-gold"
            >
              <Phone className="w-4 h-4" />
              {PHONE_NUMBER}
            </a>
            <Link
              to="/contact"
              className="luxury-btn-primary text-sm py-3 px-6"
            >
              Request Access
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border/30"
          >
            <nav className="container-luxury py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg font-medium py-2 ${
                    location.pathname.startsWith(link.href)
                      ? "text-gold"
                      : "text-foreground/80"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-border/30 flex flex-col gap-4">
                <a
                  href={PHONE_HREF}
                  className="flex items-center gap-2 text-lg font-medium text-gold"
                >
                  <Phone className="w-5 h-5" />
                  {PHONE_NUMBER}
                </a>
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="luxury-btn-primary text-center"
                >
                  Request Access
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
