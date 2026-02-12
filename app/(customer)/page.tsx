"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Ticket,
  ChevronRight,
  Clock,
  MapPin,
  Monitor,
  Timer,
  Armchair,
  Popcorn,
  Volume2,
  Film,
  CalendarDays,
  Calendar,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/movie-card";
import { HomepageLoadingSkeleton } from "@/components/homepage-skeleton";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/mock-data";
import { isShowtimeUpcoming } from "@/lib/calendar-utils";
import { useCinemaStore } from "@/lib/cinema-store";
import { HeroCarousel } from "@/components/hero-carousel";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ── Animation variants ──

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0 } },
};

// ── Section wrapper with scroll animation ──

function AnimatedSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className={className} id={id}>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={stagger}
      >
        {children}
      </motion.div>
    </section>
  );
}

// ── Month names helpers ──

function getMonthLabel(monthIdx: number, locale: string): string {
  const enMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const zhMonths = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  const kmMonths = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
  if (locale === "zh") return zhMonths[monthIdx];
  if (locale === "km") return kmMonths[monthIdx];
  return enMonths[monthIdx];
}

function getWeekdayLabel(d: Date, locale: string): string {
  if (locale === "zh") return d.toLocaleDateString("zh", { weekday: "short" });
  if (locale === "km") return d.toLocaleDateString("km", { weekday: "short" });
  return d.toLocaleDateString("en", { weekday: "short" });
}

function getTodayLabel(locale: string): string {
  if (locale === "zh") return "今天";
  if (locale === "km") return "ថ្ងៃនេះ";
  return "Today";
}

// ── Main page ──

export default function HomePage() {
  const { t, locale } = useI18n();

  const storeMovies = useCinemaStore((s) => s.movies);
  const storeShowtimes = useCinemaStore((s) => s.showtimes);
  const votes = useCinemaStore((s) => s.votes);
  const hasHydrated = useCinemaStore((s) => s._hasHydrated);
  const supabaseReady = useCinemaStore((s) => s._supabaseReady);

  // Tab state — initialize from URL hash
  const [activeTab, setActiveTab] = useState<"now" | "soon">(() => {
    if (typeof window !== "undefined") {
      return window.location.hash === "#coming-soon" ? "soon" : "now";
    }
    return "now";
  });

  // Hash ↔ tab sync
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#coming-soon") {
        setActiveTab("soon");
      } else if (hash === "#now-showing") {
        setActiveTab("now");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // On initial load, scroll to the movies section if hash is present
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#coming-soon" || hash === "#now-showing") {
      requestAnimationFrame(() => {
        const el = document.getElementById("now-showing");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }, []);

  const handleTabChange = useCallback((tab: "now" | "soon") => {
    setActiveTab(tab);
    // Use replaceState to update URL without scrolling the page
    history.replaceState(null, "", tab === "soon" ? "#coming-soon" : "#now-showing");
  }, []);

  // Date picker – 7 days (memoized to avoid new array refs each render)
  const dates = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  }), []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);

  // All now-showing movies (for hero carousel)
  const { allNowShowing, heroMovies } = useMemo(() => {
    const all = storeMovies.filter((m) =>
      m.status === "now_showing" && storeShowtimes.some((st) => st.movieId === m.id)
    );
    return { allNowShowing: all, heroMovies: all.slice(0, 4) };
  }, [storeMovies, storeShowtimes]);

  // Now-showing filtered by selectedDate (only movies with showtimes on that date)
  const nowShowing = useMemo(() => storeMovies.filter((m) => {
    if (m.status !== "now_showing") return false;
    return storeShowtimes.some(
      (st) => st.movieId === m.id && st.date === selectedDate && isShowtimeUpcoming(st.date, st.time)
    );
  }), [storeMovies, storeShowtimes, selectedDate]);

  const comingSoon = useMemo(() => storeMovies
    .filter((m) => {
      if (m.status === "hidden") return false;
      if (m.status === "coming_soon") return true;
      return !storeShowtimes.some((st) => st.movieId === m.id);
    })
    .sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0)),
  [storeMovies, storeShowtimes, votes]);

  // Month picker – next 6 months (memoized)
  const months = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    return { year: d.getFullYear(), month: d.getMonth() };
  }), []);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);

  // Filter coming soon movies by selected month
  const comingSoonFiltered = useMemo(() => comingSoon.filter((m) => {
    const rd = new Date(m.releaseDate);
    const now = new Date();
    const isCurrentMonth = selectedMonth.year === now.getFullYear() && selectedMonth.month === now.getMonth();
    if (isCurrentMonth) {
      const endOfMonth = new Date(selectedMonth.year, selectedMonth.month + 1, 0);
      return rd <= endOfMonth;
    }
    return rd.getFullYear() === selectedMonth.year && rd.getMonth() === selectedMonth.month;
  }), [comingSoon, selectedMonth]);

  // Top hyped movies (most voted) for coming soon
  const topHyped = useMemo(() => comingSoon
    .filter((m) => (votes[m.id] || 0) > 0)
    .sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0))
    .slice(0, 5),
  [comingSoon, votes]);

  const comingSoonDisplay = comingSoonFiltered;

  const displayMovies = useMemo(() =>
    activeTab === "now" ? nowShowing : comingSoonDisplay,
  [activeTab, nowShowing, comingSoonDisplay]);

  // Pre-compute showtime lookup map: movieId-date → showtimes[]
  const showtimesByMovieAndDate = useMemo(() => {
    const map: Record<string, typeof storeShowtimes> = {};
    for (const st of storeShowtimes) {
      const key = `${st.movieId}-${st.date}`;
      if (!map[key]) map[key] = [];
      map[key].push(st);
    }
    return map;
  }, [storeShowtimes]);

  // Show skeleton while:
  // 1. localStorage hasn't hydrated yet, OR
  // 2. No cached data and still waiting for Supabase (new user on deployed server)
  if (!hasHydrated || (storeMovies.length === 0 && !supabaseReady)) {
    return <HomepageLoadingSkeleton />;
  }

  return (
    <div>
      {/* ── Hero carousel ── */}
      <HeroCarousel movies={heroMovies} />



      {/* ── Tab navigation ── */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 scroll-mt-28" id="now-showing">
        <motion.div variants={fadeUp} className="flex items-end justify-between mb-6">
          <div>
            <div className="flex gap-1 p-1 bg-secondary/80 backdrop-blur-sm rounded-2xl border border-border/50">
              {[
                {
                  key: "now" as const,
                  label: t("nav.nowShowing"),
                  count: nowShowing.length,
                },
                {
                  key: "soon" as const,
                  label: t("nav.comingSoon"),
                  count: comingSoonDisplay.length,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`relative px-5 sm:px-7 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${activeTab === tab.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 bg-card rounded-xl shadow-sm border border-border/50"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span>{tab.label}</span>

                  </span>
                </button>
              ))}
            </div>
          </div>


        </motion.div>
      </AnimatedSection>

      {/* ── Date / Month picker ── */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <motion.div variants={fadeUp}>
          <AnimatePresence mode="wait">
            {activeTab === "now" ? (
              /* ── Week date picker ── */
              <motion.div
                key="date-picker"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-2 shrink-0">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:inline">
                    {t("common.date")}
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory">
                  {dates.map((date) => {
                    const d = new Date(date + "T00:00:00");
                    const isSelected = date === selectedDate;
                    const isToday = formatDate(date) === "Today";
                    return (
                      <motion.button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        whileTap={{ scale: 0.95 }}
                        className={`snap-center shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border ${isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 font-semibold"
                          : "bg-card border-border text-foreground hover:border-primary/50 hover:bg-card/80"
                          }`}
                      >
                        <div className="text-[9px] uppercase tracking-wide leading-none">
                          {isToday ? getTodayLabel(locale) : getWeekdayLabel(d, locale)}
                        </div>
                        <div className="text-lg font-semibold font-[family-name:var(--font-mono)] leading-tight">
                          {d.getDate()}
                        </div>
                        <div className="text-[9px] leading-none">
                          {d.toLocaleDateString(locale === "zh" ? "zh" : "en", { month: "short" })}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* ── Month picker for Coming Soon ── */
              <motion.div
                key="month-picker"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-2 shrink-0">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:inline">
                    {t("common.month")}
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory scroll-pl-4">
                  {months.map((m) => {
                    const isSelected = m.year === selectedMonth.year && m.month === selectedMonth.month;
                    const isCurrentMonth = m.year === new Date().getFullYear() && m.month === new Date().getMonth();
                    return (
                      <motion.button
                        key={`${m.year}-${m.month}`}
                        onClick={() => setSelectedMonth(m)}
                        whileTap={{ scale: 0.95 }}
                        className={`snap-start shrink-0 px-5 py-3 rounded-xl text-center transition-all duration-200 border min-w-[90px] ${isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 font-semibold"
                          : "bg-card border-border text-foreground hover:border-primary/50 hover:bg-card/80"
                          }`}
                      >
                        <div className="text-[10px] uppercase tracking-wide">
                          {isCurrentMonth
                            ? t("common.thisMonth")
                            : m.year.toString()}
                        </div>
                        <div className="text-base font-semibold">
                          {getMonthLabel(m.month, locale)}
                        </div>

                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatedSection>


      {/* ── Movie grid ── */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (activeTab === "now" ? selectedDate : `${selectedMonth.year}-${selectedMonth.month}`)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Show "no movies" message for coming soon */}
            {activeTab === "soon" && comingSoonDisplay.length === 0 && (
              <div className="text-center py-8 mb-6">
                <p className="text-sm text-muted-foreground">
                  {t("movie.noScheduleMonth")}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {displayMovies.map((movie, i) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  showtimes={
                    activeTab === "now"
                      ? (showtimesByMovieAndDate[`${movie.id}-${selectedDate}`] || [])
                      : []
                  }
                  index={i}
                  showVotes={activeTab === "soon"}
                  linkDate={activeTab === "now" ? selectedDate : undefined}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </AnimatedSection>

    </div>
  );
}
