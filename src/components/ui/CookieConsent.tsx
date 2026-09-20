import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONSENT_EVENT } from "@/lib/analytics";

const COOKIE_CONSENT_KEY = "lux-cookie-consent";

type ConsentStatus = "accepted" | "declined" | null;

const CookieConsent = () => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored === "accepted" || stored === "declined") {
      setConsentStatus(stored);
    } else {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setConsentStatus("accepted");
    setIsVisible(false);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setConsentStatus("declined");
    setIsVisible(false);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  // Don't render if user has already made a choice
  if (consentStatus) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="relative bg-card/95 backdrop-blur-lg border border-gold/20 rounded-xl p-6 shadow-2xl shadow-black/50">
              {/* Close button */}
              <button
                onClick={handleDecline}
                className="absolute top-4 right-4 text-muted-foreground hover:text-champagne transition-colors"
                aria-label="Close cookie banner"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-gold" />
                </div>

                {/* Content */}
                <div className="flex-1 pr-8 md:pr-0">
                  <h3 className="text-lg font-display font-semibold text-champagne mb-1">
                    Cookie Preferences
                  </h3>
                  <p className="text-sm text-champagne-muted leading-relaxed">
                    We use essential cookies to ensure our website functions properly. Optional cookies help us improve your experience. 
                    Read our{" "}
                    <Link
                      to="/privacy"
                      className="text-gold hover:text-gold-light underline underline-offset-2 transition-colors"
                    >
                      Privacy Policy
                    </Link>{" "}
                    for more details.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-row gap-3 w-full md:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleDecline}
                    className="flex-1 md:flex-none border-border hover:border-gold/50 hover:bg-gold/5 text-champagne-muted hover:text-champagne"
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className="flex-1 md:flex-none bg-gold hover:bg-gold-light text-black font-semibold"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
