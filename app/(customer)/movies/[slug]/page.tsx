"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowLeft, Clock, Play, Ticket, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  movies as mockMovies,
  getMovieBySlug,
  getShowtimesForMovie,
  formatDate,
  formatPrice,
  type Movie,
} from "@/lib/mock-data";
import { useState, useEffect, useRef } from "react";

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function MovieDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Try mock data first
  const mockMovie = getMovieBySlug(slug);

  // Also try TMDB if available
  const [tmdbMovie, setTmdbMovie] = useState<Movie | null>(null);

  useEffect(() => {
    // If no mock match, try finding from TMDB data
    if (!mockMovie) {
      fetch("/api/tmdb")
        .then((r) => r.json())
        .then((data) => {
          if (data.source === "tmdb") {
            const all = [...data.nowPlaying, ...data.upcoming, ...data.popular];
            const match = all.find((m: Movie) => m.slug === slug);
            if (match) setTmdbMovie(match);
          }
        })
        .catch(() => {});
    }
  }, [slug, mockMovie]);

  const movie = mockMovie || tmdbMovie;

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
  const [selectedDate, setSelectedDate] = useState(dates[0]);

  if (!movie) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-warm-black mb-2">
            Movie Not Found
          </h1>
          <p className="text-sm text-warm-muted mb-4">
            {`We couldn't find a movie matching "${slug}"`}
          </p>
          <Link href="/">
            <Button className="bg-gold hover:bg-gold-light text-warm-black font-semibold">
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  const allShowtimes = getShowtimesForMovie(movie.id);
  const dayShowtimes = allShowtimes.filter((s) => s.date === selectedDate);
  const ratingStars = Math.round((movie.voteAverage ?? 0) / 2);

  return (
    <div>
      {/* Backdrop */}
      <div className="relative h-[45vh] sm:h-[55vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={movie.backdropUrl}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/50 to-cream/10" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center shadow-lg shadow-gold/30 backdrop-blur-sm"
          >
            <Play className="w-7 h-7 text-warm-black ml-1" fill="currentColor" />
          </motion.button>
        </div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute top-4 left-4"
        >
          <Link
            href="/"
            className="flex items-center gap-1 px-3 py-1.5 bg-cream/80 backdrop-blur-sm rounded-lg text-sm text-warm-dark hover:bg-cream transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </motion.div>
      </div>

      {/* Movie info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-4xl mx-auto px-4 sm:px-6 -mt-20 relative z-10"
      >
        <div className="flex gap-4 sm:gap-6">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="shrink-0 w-28 sm:w-36 aspect-[2/3] rounded-xl overflow-hidden shadow-xl border-2 border-cream-light"
          >
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              width={144}
              height={216}
              className="object-cover w-full h-full"
            />
          </motion.div>

          {/* Details */}
          <div className="pt-16 sm:pt-20">
            <h1 className="font-[family-name:var(--font-display)] text-xl sm:text-3xl font-bold text-warm-black">
              {movie.title}
            </h1>
            {movie.titleKh && (
              <p className="font-[family-name:var(--font-khmer)] text-sm sm:text-base text-warm-muted mt-0.5">
                {movie.titleKh}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge className="bg-gold/20 text-gold-dark border-gold/30 font-semibold">
                {movie.rating}
              </Badge>
              <Badge variant="outline" className="text-warm-muted border-warm-border">
                {movie.subtitleLang}
              </Badge>
              {movie.duration > 0 && (
                <div className="flex items-center gap-1 text-xs text-warm-muted">
                  <Clock className="w-3.5 h-3.5" />
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}min
                </div>
              )}
              <span className="text-xs text-warm-border">|</span>
              <span className="text-xs text-warm-muted">{movie.genre.join(", ")}</span>
            </div>

            {/* TMDB rating */}
            {movie.voteAverage && movie.voteAverage > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= ratingStars ? "fill-gold text-gold" : "text-warm-border"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-[family-name:var(--font-mono)] font-medium text-warm-dark">
                  {movie.voteAverage.toFixed(1)}
                </span>
                {movie.voteCount && (
                  <span className="text-xs text-warm-muted">
                    ({movie.voteCount.toLocaleString()} votes)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Synopsis */}
        <AnimatedSection className="mt-8" delay={0.2}>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-warm-black mb-2">
            Synopsis
          </h2>
          <p className="text-sm text-warm-muted leading-relaxed">{movie.synopsis}</p>
          {movie.synopsisKh && (
            <p className="font-[family-name:var(--font-khmer)] text-sm text-warm-muted leading-relaxed mt-2">
              {movie.synopsisKh}
            </p>
          )}
        </AnimatedSection>

        {/* Showtimes */}
        {movie.status === "now_showing" && (
          <AnimatedSection className="mt-10 mb-16" delay={0.3}>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gold" />
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-warm-black">
                Showtimes
              </h2>
            </div>
            <p className="font-[family-name:var(--font-khmer)] text-xs text-warm-muted mb-4">
              ម៉ោងចាក់បញ្ចាំង
            </p>

            {/* Date pills */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6">
              {dates.map((date) => {
                const d = new Date(date + "T00:00:00");
                const isSelected = date === selectedDate;
                return (
                  <motion.button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    whileTap={{ scale: 0.95 }}
                    className={`shrink-0 px-4 py-2 rounded-xl text-center transition-all duration-200 border ${
                      isSelected
                        ? "bg-gold text-warm-black border-gold shadow-md font-semibold"
                        : "bg-cream-light border-warm-border text-warm-dark hover:border-gold/60"
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-wide">
                      {formatDate(date) === "Today" ? "Today" : d.toLocaleDateString("en", { weekday: "short" })}
                    </div>
                    <div className="text-base font-semibold font-[family-name:var(--font-mono)]">
                      {d.getDate()}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Time slots */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDate}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
              >
                {dayShowtimes.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {dayShowtimes.map((st, i) => {
                      const available = st.totalSeats - st.bookedSeats.length;
                      const fillPercent = (st.bookedSeats.length / st.totalSeats) * 100;
                      return (
                        <Link key={st.id} href={`/book/${st.id}`}>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-cream-light border border-warm-border rounded-xl p-4 text-center hover:border-gold hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                          >
                            {/* Fill indicator */}
                            <div
                              className="absolute bottom-0 left-0 right-0 bg-gold/10 transition-all duration-500"
                              style={{ height: `${fillPercent}%` }}
                            />
                            <div className="relative">
                              <div className="font-[family-name:var(--font-mono)] text-lg font-semibold text-warm-black">
                                {st.time}
                              </div>
                              <div className="text-xs text-warm-muted mt-1">
                                {available}/{st.totalSeats} seats
                              </div>
                              <div className="text-xs font-[family-name:var(--font-mono)] text-gold font-medium mt-1">
                                {formatPrice(st.price)}
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-warm-muted text-center py-8">
                    No showtimes available for this date.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </AnimatedSection>
        )}

        {movie.status === "coming_soon" && (
          <AnimatedSection className="mt-10 mb-16 text-center py-8" delay={0.3}>
            <p className="text-warm-muted text-sm mb-3">This movie is coming soon!</p>
            <p className="font-[family-name:var(--font-mono)] text-sm text-gold font-medium">
              Release:{" "}
              {new Date(movie.releaseDate).toLocaleDateString("en", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </AnimatedSection>
        )}
      </motion.div>
    </div>
  );
}
