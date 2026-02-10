import { Film, MapPin, Phone, Clock } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-warm-black text-cream-dark">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-6 h-6 text-gold" />
              <span className="font-[family-name:var(--font-display)] text-lg font-bold text-cream">
                Cambo Cinema Takeo
              </span>
            </div>
            <p className="text-sm text-warm-tertiary leading-relaxed">
              Your premier cinema experience in Takeo Province, Cambodia.
              Book tickets online and enjoy the latest movies.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-cream mb-4">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-warm-tertiary">
                <MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                <span>Takeo Province, Cambodia</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-warm-tertiary">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>012 345 678</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-warm-tertiary">
                <Clock className="w-4 h-4 text-gold shrink-0" />
                <span>Open daily 10:00 - 22:00</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-cream mb-4">
              Quick Links
            </h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-warm-tertiary hover:text-gold transition-colors">
                Now Showing
              </Link>
              <Link href="/" className="block text-sm text-warm-tertiary hover:text-gold transition-colors">
                Coming Soon
              </Link>
              <Link href="/admin" className="block text-sm text-warm-tertiary hover:text-gold transition-colors">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-warm-dark mt-8 pt-6 text-center">
          <p className="text-xs text-warm-tertiary">
            &copy; 2026 Cambo Cinema Takeo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
