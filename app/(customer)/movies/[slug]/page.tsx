"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Play, Ticket, Calendar, CalendarDays, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import {
  formatDate,
  formatPrice,
  type Movie,
} from "@/lib/mock-data";
import { useCinemaStore, getStoreShowtimesForMovie } from "@/lib/cinema-store";
import { extractYouTubeId } from "@/lib/legend";
import { getYouTubeThumbnail } from "@/lib/tmdb";
import { isShowtimeUpcoming } from "@/lib/calendar-utils";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

function SafeImage({ src, alt, noBackdrop, ...props }: { src: string; alt: string; fill?: boolean; className?: string; priority?: boolean; width?: number; height?: number; quality?: number; noBackdrop?: boolean }) {
  const [error, setError] = useState(false);
  const { t } = useI18n();

  if (error || !src || noBackdrop) {
    return (
      <div className="absolute inset-0 bg-secondary flex flex-col items-center justify-center gap-2">
        <Film className="w-12 h-12 text-muted-foreground/30" />
        <span className="text-xs text-muted-foreground/50">{t("common.noPoster")}</span>
      </div>
    );
  }
  return <Image src={src} alt={alt} onError={() => setError(true)} {...props} />;
}

export default function MovieDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const searchParams = useSearchParams();
  const initialDate = searchParams.get("date");

  const storeMovies = useCinemaStore((s) => s.movies);
  const storeShowtimes = useCinemaStore((s) => s.showtimes);
  const movie = storeMovies.find((m) => m.slug === slug) || null;

  const { t } = useI18n();

  const [showTrailer, setShowTrailer] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Auto-scroll to date section from homepage selection
  useEffect(() => {
    if (initialDate && movie) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`showtime-date-${initialDate}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [initialDate, movie]);

  if (!movie) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-2">
            {t("movie.notFound")}
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            {t("movie.notFoundDesc")} "{slug}"
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              {t("common.backToHome")}
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  const allShowtimes = getStoreShowtimesForMovie(storeShowtimes, movie.id);
  const upcomingShowtimes = allShowtimes
    .filter((s) => isShowtimeUpcoming(s.date, s.time))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const showtimesByDate: Record<string, typeof upcomingShowtimes> = {};
  upcomingShowtimes.forEach((st) => {
    if (!showtimesByDate[st.date]) showtimesByDate[st.date] = [];
    showtimesByDate[st.date].push(st);
  });
  const youtubeId = movie.trailerUrl ? extractYouTubeId(movie.trailerUrl) : null;

  // Prefer movie's own backdrop, fall back to YouTube thumbnail
  const backdropImage = movie.backdropUrl
    || (youtubeId ? getYouTubeThumbnail(youtubeId) : "");

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
          <SafeImage
            src={backdropImage}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />

        {/* Play button - opens trailer */}
        {youtubeId && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowTrailer(true)}
              className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30 backdrop-blur-sm"
            >
              <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
            </motion.button>
          </div>
        )}

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute top-24 left-4 z-20"
        >
          <Link
            href="/"
            className="flex items-center gap-1 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg text-sm text-foreground hover:bg-background transition-all active:scale-95 border border-border/50 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> {t("common.back")}
          </Link>
        </motion.div>
      </div>

      {/* YouTube Trailer Modal */}
      <AnimatePresence>
        {showTrailer && youtubeId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center cursor-pointer"
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-5xl aspect-video mx-4 sm:mx-8 lg:mx-16 cursor-default bg-black relative overflow-hidden"
              style={{
                backgroundImage: `url(${backdropImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                className={`w-full h-full transition-opacity duration-500 ${iframeLoaded ? "opacity-100" : "opacity-0"}`}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                onLoad={() => setIframeLoaded(true)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            className="shrink-0 w-28 sm:w-36 aspect-[2/3] rounded-xl overflow-hidden shadow-xl border-2 border-card"
          >
            <SafeImage
              src={movie.posterUrl}
              alt={movie.title}
              width={144}
              height={216}
              noBackdrop={!movie.backdropUrl}
              className="object-cover w-full h-full"
            />
          </motion.div>

          {/* Details */}
          <div className="pt-16 sm:pt-20">
            <h1 className="font-[family-name:var(--font-display)] text-xl sm:text-3xl font-bold text-foreground">
              {movie.title}
            </h1>
            {movie.titleKh && (
              <p className="font-[family-name:var(--font-khmer)] text-sm sm:text-base text-muted-foreground mt-0.5">
                {movie.titleKh}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge className="bg-primary/20 text-primary border-primary/30 font-semibold">
                {movie.rating}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground border-border">
                {movie.subtitleLang}
              </Badge>
              {movie.duration > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}min
                </div>
              )}
              <span className="text-xs text-border">|</span>
              <span className="text-xs text-muted-foreground">{movie.genre.join(", ")}</span>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <BlurFade delay={0.2} className="mt-8">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground mb-2">
            {t("movie.synopsis")}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{movie.synopsis}</p>
          {movie.synopsisKh && (
            <p className="font-[family-name:var(--font-khmer)] text-sm text-muted-foreground leading-relaxed mt-2">
              {movie.synopsisKh}
            </p>
          )}
        </BlurFade>

        {/* Showtimes */}
        {movie.status === "now_showing" && (
          <BlurFade delay={0.3} className="mt-10 mb-16">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-primary" />
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
                {t("movie.showtimes")}
              </h2>
            </div>
            <p className="font-[family-name:var(--font-khmer)] text-xs text-muted-foreground mb-4">
              {t("movie.showtimes")}
            </p>

            {Object.keys(showtimesByDate).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(showtimesByDate).map(([date, sts]) => {
                  const d = new Date(date + "T00:00:00");
                  const isToday = formatDate(date) === "Today";
                  const isHighlighted = date === initialDate;
                  return (
                    <div key={date} id={`showtime-date-${date}`}>
                      <div className={`text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 ${isHighlighted ? "text-primary" : "text-muted-foreground"}`}>
                        <CalendarDays className="w-3.5 h-3.5" />
                        {isToday
                          ? t("common.today")
                          : d.toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {sts.map((st) => {
                          const available = st.totalSeats - st.bookedSeats.length;
                          const fillPercent = (st.bookedSeats.length / st.totalSeats) * 100;
                          return (
                            <Link key={st.id} href={`/book/${st.id}`}>
                              <SpotlightCard className={`bg-card border rounded-xl flex flex-col items-center justify-center text-center hover:border-primary hover:shadow-md transition-all cursor-pointer relative overflow-hidden py-4 ${isHighlighted ? "border-primary/50 shadow-sm" : "border-border"}`}>
                                <div
                                  className="absolute bottom-0 left-0 right-0 bg-primary/10 transition-all duration-500"
                                  style={{ height: `${fillPercent}%` }}
                                />
                                <div className="relative">
                                  <div className="font-[family-name:var(--font-mono)] text-lg font-semibold text-foreground">
                                    {st.time}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground mt-0.5">
                                    {available}/{st.totalSeats} {t("common.seats")}
                                  </div>
                                  <div className="text-[10px] font-[family-name:var(--font-mono)] text-primary font-medium mt-0.5">
                                    {formatPrice(st.price)}
                                  </div>
                                </div>
                              </SpotlightCard>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t("movie.noShowtimes")}
              </p>
            )}
          </BlurFade>
        )}

        {movie.status === "coming_soon" && (
          <BlurFade delay={0.3} className="mt-10 mb-16 text-center py-8">
            <p className="text-muted-foreground text-sm mb-3">{t("movie.comingSoonMsg")}</p>
            <p className="font-[family-name:var(--font-mono)] text-sm text-primary font-medium">
              {t("movie.release")}{" "}
              {new Date(movie.releaseDate).toLocaleDateString("en", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </BlurFade>
        )}
      </motion.div>
    </div>
  );
}
