"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Play, Ticket, ChevronRight, Clock, ChevronLeft, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { type Movie } from "@/lib/mock-data";
import { extractYouTubeId } from "@/lib/legend";
import { getYouTubeThumbnailHQ } from "@/lib/tmdb";
import { useState, useEffect, useCallback, useRef } from "react";

// ── Safe image with error fallback ──

function HeroImage({ src, alt, ...props }: { src: string; alt: string; fill?: boolean; className?: string; priority?: boolean; sizes?: string; quality?: number }) {
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  // Reset error state when src changes
  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);

  if (error || !imgSrc) {
    return (
      <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-2">
        <Film className="w-12 h-12 text-white/20" />
        <span className="text-xs text-white/30">No movie poster available yet</span>
      </div>
    );
  }
  return <Image src={imgSrc} alt={alt} onError={() => setError(true)} {...props} />;
}

// ── Floating particles for cinematic feel ──

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: 0,
          }}
          animate={{
            y: [null, `${Math.random() * -30 - 10}%`],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ── Hero Carousel ──

export function HeroCarousel({ movies }: { movies: Movie[] }) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const featured = movies.slice(0, 4);
  const movie = featured[current];
  const { t } = useI18n();
  const isDraggingRef = useRef(false);

  const trailerId = movie?.trailerUrl ? extractYouTubeId(movie.trailerUrl) : null;
  // Prefer YouTube high-res thumbnail, fall back to TMDB backdrop
  const backdropImage = (trailerId ? getYouTubeThumbnailHQ(trailerId) : "")
    || movie?.backdropUrl || "";

  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.1]);
  const heroOpacity = useTransform(scrollY, [0, 250], [1, 0]);

  const goTo = useCallback(
    (idx: number) => {
      setCurrent(idx);
      setProgress(0);
    },
    []
  );

  // Auto-advance with progress — pauses while dragging
  useEffect(() => {
    if (isDragging) return;
    const duration = 7000;
    const interval = 50;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      setProgress((elapsed / duration) * 100);
      if (elapsed >= duration) {
        setCurrent((c) => (c + 1) % featured.length);
        elapsed = 0;
        setProgress(0);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [current, featured.length, isDragging]);

  if (!movie) return null;

  return (
    <section className="relative h-[85vh] sm:h-[92vh] overflow-hidden bg-black">
      {/* Background image with crossfade & parallax */}
      <motion.div style={{ scale: heroScale }} className="absolute inset-0">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={movie.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <HeroImage
              src={backdropImage || ""}
              alt={movie.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={100}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* YouTube Trailer Modal */}
      <AnimatePresence>
        {showTrailer && trailerId && (
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
                src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0`}
                className={`w-full h-full transition-opacity duration-500 ${iframeLoaded ? "opacity-100" : "opacity-0"}`}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                onLoad={() => setIframeLoaded(true)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic overlays — always dark for contrast */}
      {/* 1. Bottom gradient for text legibility */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* 2. Bottom transition strip — blends hero into page content */}
      <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-background to-transparent" />

      <FloatingParticles />

      {/* Content — draggable for swipe gestures */}
      <motion.div
        style={{ opacity: heroOpacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        dragDirectionLock
        onDragStart={() => {
          isDraggingRef.current = true;
          setIsDragging(true);
        }}
        onDragEnd={(_, info) => {
          isDraggingRef.current = false;
          setIsDragging(false);
          const swipe = info.offset.x;
          const threshold = 80;
          if (swipe < -threshold) goTo((current + 1) % featured.length);
          else if (swipe > threshold) goTo((current - 1 + featured.length) % featured.length);
        }}
        className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-end pb-24 sm:pb-28 cursor-grab active:cursor-grabbing"
      >
        <div className="flex w-full items-end justify-between gap-8">
          {/* Left: Movie info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-2xl"
            >
              {/* Eyebrow label */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-4"
              >
                <div className="h-px w-8 bg-primary" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-semibold">
                  {t("nav.nowShowing")}
                </span>
              </motion.div>

              {/* Genre pills */}
              <div className="flex gap-2 mb-4">
                {movie.genre.slice(0, 3).map((g) => (
                  <span
                    key={g}
                    className="text-[10px] sm:text-xs font-medium px-3 py-1.5 bg-white/15 text-white rounded-full border border-white/20 backdrop-blur-md"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight drop-shadow-lg shadow-black/50">
                {movie.title}
              </h1>
              {movie.titleKh && (
                <p className="font-[family-name:var(--font-khmer)] text-base sm:text-lg text-white/80 mt-2 font-medium drop-shadow-md">
                  {movie.titleKh}
                </p>
              )}

              {/* Meta row */}
              <div className="flex items-center gap-4 mt-5 text-sm text-white/70 font-medium drop-shadow-sm">
                {movie.duration > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" />
                  {movie.rating}
                </span>
              </div>

              {/* Synopsis */}
              <p className="text-sm text-white/70 max-w-lg mt-4 line-clamp-2 leading-relaxed drop-shadow-sm font-medium text-balance">
                {movie.synopsis}
              </p>

              {/* CTAs */}
              <div className="flex gap-3 mt-7">
                <Link href={`/movies/${movie.slug}`}>
                  <Button className="text-sm h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl border border-primary/50 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300">
                    <Ticket className="w-4 h-4 mr-2" />
                    {t("hero.bookNow")}
                  </Button>
                </Link>
                {trailerId && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setIframeLoaded(false);
                      setShowTrailer(true);
                    }}
                    className="h-12 border-white/30 text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-all duration-200 active:scale-[0.97] rounded-xl"
                  >
                    <Play className="w-4 h-4 mr-2 fill-white" />
                    {t("hero.trailer")}
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right: Mini poster strip */}
          <div className="hidden lg:flex flex-col gap-3 items-end">
            {featured.map((m, i) => (
              <motion.button
                key={m.id}
                onClick={() => goTo(i)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`relative w-[100px] aspect-[2/3] rounded-xl overflow-hidden border-2 transition-all duration-300 ${i === current
                  ? "border-primary shadow-lg shadow-primary/30 scale-105"
                  : "border-white/10 opacity-50 hover:opacity-80 hover:border-white/30"
                  }`}
              >
                <HeroImage
                  src={m.posterUrl}
                  alt={m.title}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
                {i === current && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                    style={{ scaleX: progress / 100, transformOrigin: "left" }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Bottom carousel controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 lg:hidden">
          <button
            onClick={() => goTo((current - 1 + featured.length) % featured.length)}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 backdrop-blur-sm transition-all active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-2">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: i === current ? 32 : 8 }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full" />
                {i === current && (
                  <motion.div
                    className="absolute inset-0 bg-primary rounded-full"
                    style={{ scaleX: progress / 100, transformOrigin: "left" }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => goTo((current + 1) % featured.length)}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 backdrop-blur-sm transition-all active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
