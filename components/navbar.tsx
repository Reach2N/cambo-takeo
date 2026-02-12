"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Search, Menu, X, Film, Sun, Moon, Ticket, ChevronDown, QrCode, Home, Calendar, Settings, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useI18n, type Locale } from "@/lib/i18n";
import { useCinemaStore, getStoreMovieById } from "@/lib/cinema-store";
import { formatPrice, formatDate } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function SearchPoster({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className="w-8 h-12 rounded bg-secondary flex items-center justify-center shrink-0">
        <Film className="w-3 h-3 text-muted-foreground/40" />
      </div>
    );
  }
  return (
    <div className="w-8 h-12 rounded overflow-hidden shrink-0 bg-secondary">
      <Image src={src} alt={alt} width={32} height={48} className="object-cover w-full h-full" onError={() => setError(true)} />
    </div>
  );
}

const languages: { key: Locale; label: string; flag: string }[] = [
  { key: "km", label: "ខ្មែរ", flag: "🇰🇭" },
  { key: "en", label: "EN", flag: "🇬🇧" },
  { key: "zh", label: "中文", flag: "🇨🇳" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [ticketsOpen, setTicketsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();

  // Programmatic hash navigation
  const scrollToMovies = (hash: string) => {
    history.replaceState(null, "", `/${hash}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    const el = document.getElementById("now-showing");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const storeMovies = useCinemaStore((s) => s.movies);
  const storeShowtimes = useCinemaStore((s) => s.showtimes);
  const purchasedTickets = useCinemaStore((s) => s.purchasedTickets);

  // Filter movies by search query
  const searchResults = searchQuery.trim().length >= 2
    ? storeMovies.filter((m) => {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.titleKh.includes(q) ||
        m.genre.some((g) => g.toLowerCase().includes(q))
      );
    }).slice(0, 6)
    : [];

  // Close search results when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        searchRef.current && !searchRef.current.contains(e.target as Node) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentLang = languages.find((l) => l.key === locale) ?? languages[0];

  const cycleLanguage = () => {
    const currentIdx = languages.findIndex((l) => l.key === locale);
    const nextIdx = (currentIdx + 1) % languages.length;
    setLocale(languages[nextIdx].key);
  };

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none font-[family-name:var(--font-dm-sans)]">
        <div className="pointer-events-auto w-full max-w-6xl bg-background/95 backdrop-blur-xl border border-border/60 shadow-xl rounded-full flex items-center justify-between p-2 pl-4 pr-2 gap-4 transition-all duration-300 dark:bg-zinc-900/95 dark:border-zinc-800/60">

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image
              src="/cambo-cinema.jpg"
              alt="Cambo Cinema Takeo"
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover group-hover:scale-110 transition-transform shadow-sm"
            />
            <div className="leading-none ">
              <span className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground tracking-tight">
                Cambo Cinema Takeo
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Pills */}
          <div className="hidden lg:flex items-center gap-1 bg-secondary/60 p-1.5 rounded-full border border-border/40">
            <Link
              href="/"
              className="px-5 py-2 rounded-full text-sm font-medium text-foreground hover:bg-background hover:shadow-sm transition-all"
            >
              {t("nav.home")}
            </Link>
            <button
              onClick={() => scrollToMovies("#now-showing")}
              className="px-5 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm transition-all"
            >
              {t("nav.nowShowing")}
            </button>
            <button
              onClick={() => scrollToMovies("#coming-soon")}
              className="px-5 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm transition-all"
            >
              {t("nav.comingSoon")}
            </button>
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="px-5 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm transition-all"
            >
              {t("nav.contact")}
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            {/* Desktop Search */}
            <div className="hidden md:block relative" ref={searchRef}>
              <div className={`flex items-center transition-all duration-300 ${searchOpen ? "w-64 bg-secondary/80 rounded-full px-3 ring-2 ring-primary/20" : "w-auto"}`}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`p-2.5 rounded-full hover:bg-secondary transition-colors ${searchOpen ? "text-primary" : "text-foreground/80"}`}
                >
                  <Search className="w-4.5 h-4.5" />
                </button>
                {searchOpen && (
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                    onFocus={() => setShowResults(true)}
                    placeholder={t("nav.searchMovies")}
                    className="w-full bg-transparent border-none focus:outline-none text-sm px-2 py-1.5 font-medium"
                    autoFocus
                  />
                )}
              </div>

              {/* Desktop Search Results */}
              <AnimatePresence>
                {searchOpen && showResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-80 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-2 space-y-1">
                      {searchResults.map((movie) => (
                        <Link
                          key={movie.id}
                          href={`/movies/${movie.slug}`}
                          onClick={() => { setSearchQuery(""); setShowResults(false); setSearchOpen(false); }}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-primary/10 transition-colors group"
                        >
                          <SearchPoster src={movie.posterUrl} alt={movie.title} />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate font-[family-name:var(--font-display)]">{movie.title}</div>
                            <div className="text-[10px] text-muted-foreground">{movie.genre.slice(0, 2).join(", ")}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => { setSearchOpen(!searchOpen); setMobileOpen(false); }}
              className="md:hidden p-2.5 rounded-full hover:bg-secondary transition-colors text-foreground/80"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Tickets */}
            <button
              onClick={() => setTicketsOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-secondary transition-colors text-foreground/80"
            >
              <Ticket className="w-5 h-5" />
              {purchasedTickets.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center shadow-sm font-[family-name:var(--font-mono)]">
                  {purchasedTickets.length}
                </span>
              )}
            </button>

            {/* Admin Link (Desktop) */}
            <Link
              href="/admin"
              className="hidden lg:flex p-2.5 rounded-full hover:bg-secondary transition-colors text-foreground/80"
              title={t("nav.admin")}
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden sm:flex p-2.5 rounded-full hover:bg-secondary transition-colors text-foreground/80"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Language (Desktop) */}
            <div className="hidden sm:block relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-full border border-border/50 hover:bg-secondary/80 text-sm font-semibold transition-colors bg-secondary/30"
              >
                <span className="text-base leading-none">{currentLang.flag}</span>
                <span className="text-foreground/90">{currentLang.label}</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 z-50 w-36 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-xl overflow-hidden p-1"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.key}
                          onClick={() => {
                            setLocale(lang.key);
                            setLangOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${locale === lang.key ? "bg-primary/10 text-primary font-bold" : "text-foreground hover:bg-secondary font-medium"
                            }`}
                        >
                          <span className="text-base leading-none">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed inset-x-4 top-24 z-40 p-2 md:hidden font-[family-name:var(--font-dm-sans)]"
          >
            <div className="bg-card/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl overflow-hidden p-4 space-y-4">
              {/* Mobile Nav Links */}
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-secondary/30 text-foreground font-semibold hover:bg-secondary transition-colors"
                >
                  <Home className="w-5 h-5 text-primary" />
                  {t("nav.home")}
                </Link>
                <button
                  onClick={() => { scrollToMovies("#now-showing"); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-muted-foreground font-medium hover:bg-secondary transition-colors"
                >
                  <Film className="w-5 h-5" />
                  {t("nav.nowShowing")}
                </button>
                <button
                  onClick={() => { scrollToMovies("#coming-soon"); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-muted-foreground font-medium hover:bg-secondary transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  {t("nav.comingSoon")}
                </button>
                <button
                  onClick={() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-muted-foreground font-medium hover:bg-secondary transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  {t("nav.contact")}
                </button>
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-muted-foreground font-medium hover:bg-secondary transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  {t("nav.admin")}
                </Link>
              </div>

              <div className="h-px bg-border/50" />

              {/* Mobile Utilities */}
              <div className="flex items-center justify-between px-2">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary transition-colors text-sm font-medium"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{theme === "dark" ? "Light" : "Dark"}</span>
                </button>
                <button
                  onClick={cycleLanguage}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary transition-colors text-sm font-medium"
                >
                  <span className="text-base">{currentLang.flag}</span>
                  <span>{currentLang.label}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-20 z-40 md:hidden"
          >
            <div className="bg-card/90 backdrop-blur-xl border border-border rounded-3xl shadow-2xl overflow-hidden p-3" ref={mobileSearchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                  placeholder={t("nav.searchMovies")}
                  autoFocus
                  className="w-full pl-9 pr-10 py-3 bg-secondary/50 border border-border/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Mobile Search Results */}
              {showResults && searchResults.length > 0 && (
                <div className="mt-3 space-y-1 max-h-60 overflow-y-auto">
                  {searchResults.map((movie) => (
                    <Link
                      key={movie.id}
                      href={`/movies/${movie.slug}`}
                      onClick={() => { setSearchQuery(""); setShowResults(false); setSearchOpen(false); }}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary transition-colors"
                    >
                      <SearchPoster src={movie.posterUrl} alt={movie.title} />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground truncate">{movie.title}</div>
                        <div className="text-[10px] text-muted-foreground">{movie.genre.slice(0, 2).join(", ")}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket History Modal */}
      <AnimatePresence>
        {ticketsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setTicketsOpen(false)}
              className="fixed inset-0 bg-black z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] max-w-md mx-auto bg-card border border-border rounded-3xl z-[61] max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border/50 bg-secondary/20">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-primary" />
                  <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
                    {t("nav.myTickets")}
                  </h2>
                </div>
                <button onClick={() => setTicketsOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-4">
                {purchasedTickets.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Ticket className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {t("nav.noTickets")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 px-8">
                      {t("nav.bookToSeeTickets")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {purchasedTickets.map((ticket) => {
                      const movie = getStoreMovieById(storeMovies, ticket.movieId);
                      const showtime = storeShowtimes.find((s) => s.id === ticket.showtimeId);
                      return (
                        <Link
                          key={ticket.id}
                          href={`/book/${ticket.showtimeId}/success?seats=${ticket.seats.join(",")}&total=${ticket.total}`}
                          onClick={() => setTicketsOpen(false)}
                          className="block bg-card hover:bg-secondary/30 border border-border rounded-2xl p-4 space-y-3 transition-colors group relative overflow-hidden"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                {movie?.title || "Unknown Movie"}
                              </h3>
                              {movie?.titleKh && (
                                <p className="font-[family-name:var(--font-khmer)] text-[11px] text-muted-foreground truncate">
                                  {movie.titleKh}
                                </p>
                              )}
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                              <QrCode className="w-5 h-5" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs opacity-80">
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-0.5">Date</span>
                              <span className="text-foreground font-medium">
                                {showtime ? formatDate(showtime.date) : ticket.purchaseDate.split("T")[0]}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-0.5">Time</span>
                              <span className="font-[family-name:var(--font-mono)] text-foreground font-medium">
                                {showtime?.time || "—"}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-0.5">Seats</span>
                              <div className="flex flex-wrap gap-1">
                                {ticket.seats.map((seat) => (
                                  <span
                                    key={seat}
                                    className="text-[10px] font-[family-name:var(--font-mono)] px-1.5 py-0.5 bg-secondary text-foreground rounded font-medium"
                                  >
                                    {seat}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-0.5">Total</span>
                              <span className="font-[family-name:var(--font-mono)] text-foreground font-bold">
                                {formatPrice(ticket.total)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
