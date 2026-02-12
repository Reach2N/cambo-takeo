"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { useI18n, type Locale } from "@/lib/i18n";
import { useTheme } from "next-themes";
import { Sun, Moon, ChevronDown, Globe } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const languages: { key: Locale; label: string; flag: string }[] = [
  { key: "km", label: "ខ្មែរ", flag: "🇰🇭" },
  { key: "en", label: "EN", flag: "🇬🇧" },
  { key: "zh", label: "中文", flag: "🇨🇳" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { locale, setLocale, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = languages.find((l) => l.key === locale) ?? languages[0];

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen min-w-0 overflow-x-hidden bg-background">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border px-4 lg:px-6 h-16 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline font-[family-name:var(--font-mono)]">
              {new Date().toLocaleDateString(locale === "km" ? "km" : locale === "zh" ? "zh" : "en", { weekday: "short", month: "short", day: "numeric" })}
            </span>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-primary" />
              ) : (
                <Moon className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {/* Language dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border hover:bg-secondary text-xs font-medium transition-colors"
              >
                <span className="text-sm leading-none">{currentLang.flag}</span>
                <span className="text-foreground/80">{currentLang.label}</span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 z-50 w-36 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.key}
                          onClick={() => {
                            setLocale(lang.key);
                            setLangOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-secondary transition-colors ${
                            locale === lang.key ? "text-primary font-semibold bg-primary/5" : "text-foreground"
                          }`}
                        >
                          <span className="text-sm leading-none">{lang.flag}</span>
                          <span>{lang.label}</span>
                          {locale === lang.key && (
                            <span className="ml-auto text-primary text-[10px]">✓</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              A
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
