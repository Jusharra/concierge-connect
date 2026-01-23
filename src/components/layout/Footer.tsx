import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { SITE_NAME, PHONE_NUMBER, PHONE_HREF, EMAIL, CATEGORIES } from "@/lib/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-obsidian border-t border-border/30">
      <div className="container-luxury section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-serif font-semibold tracking-tight logo-animated">
                {SITE_NAME}
              </span>
            </Link>
            <p className="body-regular mb-6">
              Discreet access to extraordinary experiences. Verified partners. 
              Complete confidentiality.
            </p>
            <div className="divider-gold mb-6"></div>
            <div className="flex flex-col gap-3">
              <a href={PHONE_HREF} className="flex items-center gap-3 text-foreground hover-gold">
                <Phone className="w-4 h-4 text-gold" />
                <span className="text-sm">{PHONE_NUMBER}</span>
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-foreground hover-gold">
                <Mail className="w-4 h-4 text-gold" />
                <span className="text-sm">{EMAIL}</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-gold" />
                <span className="text-sm">Miami • Los Angeles • New York</span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-serif text-lg font-medium text-foreground mb-6">Services</h4>
            <ul className="flex flex-col gap-3">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={cat.href}
                    className="text-sm text-muted-foreground hover:text-gold transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Cities Column */}
          <div>
            <h4 className="font-serif text-lg font-medium text-foreground mb-6">Popular Cities</h4>
            <ul className="flex flex-col gap-3">
              {["Miami", "Los Angeles", "New York", "Aspen", "Monaco"].map((city) => (
                <li key={city}>
                  <span className="text-sm text-muted-foreground">{city}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Column */}
          <div>
            <h4 className="font-serif text-lg font-medium text-foreground mb-6">Our Promise</h4>
            <ul className="flex flex-col gap-3">
              <li className="text-sm text-muted-foreground">Complete Discretion</li>
              <li className="text-sm text-muted-foreground">Verified Partners Only</li>
              <li className="text-sm text-muted-foreground">24/7 Concierge Support</li>
              <li className="text-sm text-muted-foreground">No Booking Fees</li>
              <li className="text-sm text-muted-foreground">White-Glove Service</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-gold transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-gold transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
