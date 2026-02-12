"use client";

import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";

// Payment brand SVG logos rendered inline for reliability
function VisaLogo() {
  return (
    <div className="h-8 w-14 bg-white rounded-md flex items-center justify-center px-1">
      <svg viewBox="0 0 780 500" className="h-5 w-full" fill="none">
        <path d="M293.2 348.7l33.4-195.7h53.4l-33.4 195.7h-53.4z" fill="#1434CB" />
        <path d="M530.9 156.5c-10.5-4-27.1-8.3-47.8-8.3-52.7 0-89.8 26.5-90.1 64.5-.3 28.1 26.5 43.8 46.8 53.1 20.8 9.6 27.8 15.7 27.7 24.3-.1 13.1-16.6 19.1-31.9 19.1-21.4 0-32.7-3-50.3-10.2l-6.9-3.1-7.5 43.8c12.5 5.5 35.6 10.2 59.6 10.5 56.1 0 92.5-26.2 92.9-66.8.2-22.3-14-39.2-44.8-53.2-18.6-9.1-30-15.1-29.9-24.3 0-8.1 9.6-16.8 30.4-16.8 17.4-.3 29.9 3.5 39.7 7.4l4.8 2.2 7.2-42.2z" fill="#1434CB" />
        <path d="M618.1 153h-41.2c-12.8 0-22.3 3.5-27.9 16.2l-79.2 178.5h56.1s9.2-24 11.2-29.3h68.5c1.6 6.9 6.5 29.3 6.5 29.3h49.6l-43.5-194.7zm-65.9 125.4c4.4-11.3 21.4-54.7 21.4-54.7-.3.5 4.4-11.4 7.1-18.8l3.6 17s10.3 46.9 12.4 56.5h-44.5z" fill="#1434CB" />
        <path d="M247.8 153l-52.2 133.4-5.6-27c-9.7-31-39.9-64.7-73.7-81.5l47.8 170.5h56.5l84.1-195.4h-56.9z" fill="#1434CB" />
        <path d="M146.9 153H60.9l-.7 3.7c67 16.2 111.3 55.2 129.7 102.1L171.8 169c-3.2-12.4-12.5-15.6-24.9-16z" fill="#F9A533" />
      </svg>
    </div>
  );
}

function MastercardLogo() {
  return (
    <div className="h-8 w-14 bg-white rounded-md flex items-center justify-center px-1">
      <svg viewBox="0 0 780 500" className="h-5 w-full">
        <circle cx="312" cy="250" r="155" fill="#EB001B" />
        <circle cx="468" cy="250" r="155" fill="#F79E1B" />
        <path d="M390 116.3c42.3 33.3 69.4 84.3 69.4 141.7s-27.1 108.4-69.4 141.7c-42.3-33.3-69.4-84.3-69.4-141.7s27.1-108.4 69.4-141.7z" fill="#FF5F00" />
      </svg>
    </div>
  );
}

function BakongLogo() {
  return (

    <Image src="/KHQR.png" alt="KHQR" width={80} height={100} />

  );
}




function CashLogo() {
  return (
    <div className="h-8 w-14 bg-emerald-600 rounded-md flex items-center justify-center">
      <span className="text-[10px] font-bold text-white">CASH</span>
    </div>
  );
}

export function Footer() {
  const { t } = useI18n();

  const scrollToMovies = (hash: string) => {
    history.replaceState(null, "", `/${hash}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    const el = document.getElementById("now-showing");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col">

      {/* --- THE IMAGE (The Skyline) --- */}
      <div className="w-full relative select-none pointer-events-none bg-background">
        {/* Image tinted to match footer via color overlay */}
        <div className="relative">
          <img
            src="/cambodia-background.png"
            alt="Cambodia Skyline"
            className="w-full h-auto block opacity-100 mix-blend-luminosity"
          />
          {/* Color overlay: tints image to footer color */}
          <div className="absolute inset-0 bg-black dark:bg-[#1A0A0F] mix-blend-color opacity-100" />
          {/* Top fade: blends from page background (Cream/Dark) into the image */}
          <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-background via-background/60 via-60% to-transparent" />
        </div>
        {/* Pixel-perfect seam eliminator - matches footer bg */}
        <div className="absolute inset-x-0 -bottom-px h-1 bg-black dark:bg-[#1A0A0F]" />
      </div>

      <footer className="relative bg-black dark:bg-[#1A0A0F] text-[#F5F0E6] overflow-visible">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Brand & Description */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-2.5 mb-4">
                <Image
                  src="/cambo-cinema.jpg"
                  alt="Cambo Cinema"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-xl object-cover"
                />
                <div className="leading-tight">
                  <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[#F5F0E6] tracking-tight">
                    Cambo Cinema
                  </span>
                  <span className="text-[10px] text-primary block -mt-0.5 font-semibold tracking-widest uppercase">
                    TAKEO
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#F5F0E6]/50 leading-relaxed max-w-xs">
                {t("footer.description")}
              </p>

              {/* Social links */}
              <div className="flex gap-2 mt-5">
                <a href="#" className="w-9 h-9 rounded-lg bg-[#F5F0E6]/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-[#F5F0E6]/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-[#F5F0E6]/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-[#F5F0E6]/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.11V9.01a6.36 6.36 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.77 1.52V6.82a4.84 4.84 0 01-1.01-.13z" />
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-[#F5F0E6]/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-[#F5F0E6]/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 17.738c-.26.644-1.523 1.263-2.094 1.339-.57.076-1.113.227-3.747-.782-3.177-1.217-5.194-4.463-5.35-4.668-.156-.206-1.273-1.696-1.273-3.234 0-1.538.803-2.292 1.089-2.604.286-.312.623-.39.831-.39.208 0 .416.002.598.011.192.009.45-.073.703.536.26.627.882 2.153.959 2.31.078.156.13.338.026.545-.104.208-.156.337-.312.52-.156.182-.328.407-.468.546-.156.156-.319.326-.137.64.182.312.81 1.337 1.74 2.166 1.192 1.065 2.197 1.394 2.51 1.55.311.156.493.13.675-.078.182-.208.78-.91.988-1.223.208-.312.416-.26.701-.156.286.104 1.81.854 2.121 1.01.312.156.52.234.598.364.078.13.078.754-.182 1.398z" fillRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-3">
              <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[#F5F0E6] mb-4">
                {t("footer.contact")}
              </h3>
              <div className="space-y-3">

                <div className="flex items-center gap-2.5 text-sm text-[#F5F0E6]/50">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-[#F5F0E6]/70">012 345 678</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-[#F5F0E6]/50">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-[#F5F0E6]/70">under@tnaot.xyz</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-[#F5F0E6]/50">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <span className="text-[#F5F0E6]/70">{t("footer.hours")}</span>
                    <br />
                    <span className="text-xs">{t("footer.openDaily")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-2">
              <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[#F5F0E6] mb-4">
                {t("footer.quickLinks")}
              </h3>
              <div className="space-y-2.5">
                {[
                  { hash: "#now-showing", label: t("nav.nowShowing") },
                  { hash: "#coming-soon", label: t("nav.comingSoon") },
                ].map((link) => (
                  <button
                    key={link.hash}
                    onClick={() => scrollToMovies(link.hash)}
                    className="block text-sm text-[#F5F0E6]/50 hover:text-primary transition-colors text-left"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accepted Payments */}
            <div className="md:col-span-3">
              <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[#F5F0E6] mb-4">
                {t("footer.payments")}
              </h3>
              <div className="flex flex-wrap gap-2">
                <VisaLogo />
                <MastercardLogo />
                <BakongLogo />
                <CashLogo />
              </div>
              <p className="text-xs text-[#F5F0E6]/30 mt-3">
                {t("footer.paymentsDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* Location map strip */}
        {/* Location map */}
        <div className="border-t border-[#F5F0E6]/10">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-2 text-sm text-[#F5F0E6]/40 mb-3">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>National Road 2, Roka Knong, Dounkeo, Takeo Province, Cambodia</span>
            </div>
            <div className="rounded-xl overflow-hidden border border-[#F5F0E6]/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.6558170965955!2d104.76068064645332!3d10.989330627418125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310977002c956189%3A0x29814ffa6bb0b080!2sCambo%20Cinema%20Takeo!5e0!3m2!1sen!2skh!4v1770887165202!5m2!1sen!2skh"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Cambo Cinema Takeo Location"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#F5F0E6]/10">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-[#F5F0E6]/30">
              &copy; 2026 Cambo Cinema Takeo. {t("footer.allRights")}
            </p>

          </div>
        </div>
      </footer>
    </div>
  );
}
