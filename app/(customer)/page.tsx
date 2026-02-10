"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Play, Ticket, ChevronRight, Star, Clock, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/movie-card";
import { movies as mockMovies, showtimes, formatDate, type Movie } from "@/lib/mock-data";
import { useState, useEffect, useRef, useCallback } from "react";

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
  visible: { transition: { staggerChildren: 0.08 } },
};

// ── Section wrapper with scroll animation ──

function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className={className}>
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

// ── Hero Carousel ──

function HeroCarousel({ movies }: { movies: Movie[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const featured = movies.slice(0, 4);
  const movie = featured[current];

  const goTo = useCallback(
    (idx: number) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent(idx);
    },
    [current]
  );

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % featured.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (!movie) return null;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "8%" : "-8%", opacity: 0, scale: 1.02 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-8%" : "8%", opacity: 0, scale: 0.98 }),
  };

  return (
    <section className="relative h-[75vh] sm:h-[80vh] overflow-hidden bg-warm-black">
      {/* Background image with crossfade */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={movie.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={movie.backdropUrl}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-cream/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-end pb-16 sm:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Genre pills */}
            <div className="flex gap-2 mb-3">
              {movie.genre.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="text-[10px] sm:text-xs font-medium px-2.5 py-1 bg-gold/20 text-gold-dark rounded-full border border-gold/30 backdrop-blur-sm"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl lg:text-6xl font-bold text-warm-black leading-tight max-w-2xl">
              {movie.title}
            </h1>
            {movie.titleKh && (
              <p className="font-[family-name:var(--font-khmer)] text-base sm:text-lg text-warm-dark/80 mt-1">
                {movie.titleKh}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-3 mt-3 text-sm text-warm-muted">
              {movie.voteAverage && movie.voteAverage > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                  <span className="font-[family-name:var(--font-mono)] font-medium text-warm-dark">
                    {movie.voteAverage.toFixed(1)}
                  </span>
                </span>
              )}
              {movie.duration > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
              )}
            </div>

            {/* Synopsis */}
            <p className="text-sm text-warm-muted max-w-lg mt-3 line-clamp-2 leading-relaxed">
              {movie.synopsis}
            </p>

            {/* CTAs */}
            <div className="flex gap-3 mt-5">
              <Link href={`/movies/${movie.slug}`}>
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold-light text-warm-black font-semibold px-6 shadow-lg shadow-gold/25 transition-all duration-200 hover:shadow-xl hover:shadow-gold/30 active:scale-[0.97]"
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-warm-border/60 text-warm-dark hover:bg-cream-dark/60 backdrop-blur-sm transition-all duration-200 active:scale-[0.97]"
              >
                <Play className="w-4 h-4 mr-2" />
                Trailer
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel navigation */}
        <div className="absolute bottom-6 right-4 sm:right-6 flex items-center gap-3">
          {/* Prev/Next */}
          <button
            onClick={() => goTo((current - 1 + featured.length) % featured.length)}
            className="w-9 h-9 rounded-full border border-warm-border/50 flex items-center justify-center text-warm-dark hover:bg-cream-dark/60 backdrop-blur-sm transition-all active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative h-1.5 rounded-full transition-all duration-300 overflow-hidden"
                style={{ width: i === current ? 24 : 8 }}
              >
                <div className="absolute inset-0 bg-warm-border/50 rounded-full" />
                {i === current && (
                  <motion.div
                    layoutId="hero-dot"
                    className="absolute inset-0 bg-gold rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => goTo((current + 1) % featured.length)}
            className="w-9 h-9 rounded-full border border-warm-border/50 flex items-center justify-center text-warm-dark hover:bg-cream-dark/60 backdrop-blur-sm transition-all active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Main page ──

export default function HomePage() {
  const [tmdbMovies, setTmdbMovies] = useState<{
    nowPlaying: Movie[];
    upcoming: Movie[];
    popular: Movie[];
    source: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"now" | "soon">("now");

  useEffect(() => {
    fetch("/api/tmdb")
      .then((r) => r.json())
      .then((data) => {
        if (data.source === "tmdb" && data.nowPlaying.length > 0) {
          setTmdbMovies(data);
        }
      })
      .catch(() => {});
  }, []);

  // Use TMDB data if available, otherwise mock data
  const nowShowing =
    tmdbMovies && tmdbMovies.nowPlaying.length > 0
      ? tmdbMovies.nowPlaying
      : mockMovies.filter((m) => m.status === "now_showing");

  const comingSoon =
    tmdbMovies && tmdbMovies.upcoming.length > 0
      ? tmdbMovies.upcoming
      : mockMovies.filter((m) => m.status === "coming_soon");

  const heroMovies = nowShowing.slice(0, 4);
  const displayMovies = activeTab === "now" ? nowShowing : comingSoon;

  // Date picker
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
  const [selectedDate, setSelectedDate] = useState(dates[0]);

  return (
    <div className="overflow-hidden">
      {/* ── Hero carousel ── */}
      <HeroCarousel movies={heroMovies} />

      {/* ── Quick date picker strip ── */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {dates.map((date) => {
            const d = new Date(date + "T00:00:00");
            const isSelected = date === selectedDate;
            return (
              <motion.button
                key={date}
                onClick={() => setSelectedDate(date)}
                whileTap={{ scale: 0.95 }}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-center transition-all duration-200 border ${
                  isSelected
                    ? "bg-gold text-warm-black border-gold shadow-md shadow-gold/20 font-semibold"
                    : "bg-cream-light border-warm-border text-warm-dark hover:border-gold/60"
                }`}
              >
                <div className="text-[10px] uppercase tracking-wide">
                  {formatDate(date) === "Today" ? "Today" : d.toLocaleDateString("en", { weekday: "short" })}
                </div>
                <div className="text-lg font-semibold font-[family-name:var(--font-mono)]">
                  {d.getDate()}
                </div>
                <div className="text-[10px]">
                  {d.toLocaleDateString("en", { month: "short" })}
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatedSection>

      {/* ── Tab navigation ── */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
          <div className="flex gap-1 p-1 bg-cream-dark rounded-xl">
            {[
              { key: "now" as const, label: "Now Showing", labelKh: "កំពុងចាក់បញ្ចាំង" },
              { key: "soon" as const, label: "Coming Soon", labelKh: "មកដល់ឆាប់ៗ" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.key ? "text-warm-black" : "text-warm-muted hover:text-warm-dark"
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 bg-cream-light rounded-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex flex-col">
                  <span>{tab.label}</span>
                  <span className="font-[family-name:var(--font-khmer)] text-[10px] opacity-60">{tab.labelKh}</span>
                </span>
              </button>
            ))}
          </div>

          <Link
            href="/"
            className="hidden sm:flex text-sm text-gold hover:text-gold-dark items-center gap-1 font-medium transition-colors group"
          >
            View All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </AnimatedSection>

      {/* ── Movie grid ── */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5"
          >
            {displayMovies.map((movie, i) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                showtimes={
                  activeTab === "now"
                    ? showtimes.filter((s) => s.movieId === movie.id && s.date === selectedDate)
                    : []
                }
                index={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </AnimatedSection>

      {/* ── Featured / popular section ── */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-gold" />
          <h2 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold text-warm-black">
            Popular This Week
          </h2>
        </motion.div>

        <motion.div variants={fadeUp} className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
          {(tmdbMovies?.popular ?? nowShowing).slice(0, 6).map((movie, i) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.slug}`}
              className="shrink-0 w-[280px] sm:w-[340px] group"
            >
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative aspect-video rounded-xl overflow-hidden"
              >
                <Image
                  src={movie.backdropUrl}
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="340px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warm-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-3">
                  <h3 className="text-sm font-semibold text-cream-light">{movie.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-cream-dark/80">
                    {movie.voteAverage && (
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-gold text-gold" />
                        {movie.voteAverage.toFixed(1)}
                      </span>
                    )}
                    <span>{movie.genre.slice(0, 2).join(", ")}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </AnimatedSection>

      {/* ── Cinema info strip ── */}
      <AnimatedSection className="border-t border-warm-border bg-cream-dark/50">
        <motion.div
          variants={fadeUp}
          className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
        >
          {[
            { label: "Location", value: "Takeo Town, Cambodia", sub: "ក្រុងតាកែវ" },
            { label: "Screens", value: "1 Screen · 120 Seats", sub: "អេក្រង់ ១ · កៅអី ១២០" },
            { label: "Hours", value: "2:00 PM – 11:00 PM", sub: "ម៉ោង ២ - ១១ យប់" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs uppercase tracking-widest text-gold font-medium mb-1">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-warm-black">{item.value}</p>
              <p className="font-[family-name:var(--font-khmer)] text-xs text-warm-muted mt-0.5">
                {item.sub}
              </p>
            </div>
          ))}
        </motion.div>
      </AnimatedSection>
    </div>
  );
}
