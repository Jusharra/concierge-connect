import { Phone } from "lucide-react";
import { PHONE_HREF } from "@/lib/constants";

const StickyCallButton = () => {
  return (
    <a
      href={PHONE_HREF}
      className="fixed bottom-6 right-6 z-50 lg:hidden flex items-center justify-center w-14 h-14 rounded-full bg-gradient-gold shadow-gold animate-glow"
      aria-label="Call Concierge"
    >
      <Phone className="w-6 h-6 text-primary-foreground" />
    </a>
  );
};

export default StickyCallButton;
