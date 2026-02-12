"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Clock, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { VoteButton } from "@/components/vote-button";
import type { Movie, Showtime } from "@/lib/mock-data";
import { useRef, useState, useMemo, memo } from "react";
import { useI18n } from "@/lib/i18n";

interface MovieCardProps {
  movie: Movie;
  showtimes?: Showtime[];
  index?: number;
  showVotes?: boolean;
  linkDate?: string;
}

function isNAValue(val: string | undefined | null): boolean {
  if (!val || !val.trim()) return true;
  const trimmed = val.trim().toUpperCase();
  return trimmed === "NA" || trimmed === "N/A";
}

function SafeImage({ src, alt, className, noBackdrop, ...props }: { src: string; alt: string; fill?: boolean; className?: string; sizes?: string; width?: number; height?: number; noBackdrop?: boolean }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { t } = useI18n();
  if (error || !src || noBackdrop || isNAValue(src)) {
    return (
      <div className="absolute inset-0 bg-secondary flex flex-col items-center justify-center gap-2 p-4">
        <Film className="w-8 h-8 text-muted-foreground/40" />
        <span className="text-[10px] text-muted-foreground/60 text-center leading-tight">{t("common.noPoster")}</span>
      </div>
    );
  }
  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 bg-secondary animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
        className={`${className || ""} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        {...props}
      />
    </>
  );
}

export const MovieCard = memo(function MovieCard({ movie, showtimes = [], index = 0, showVotes = false, linkDate }: MovieCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const todayShowtimes = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return showtimes.filter((s) => s.date === today);
  }, [showtimes]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 20, scale: 0.97 }
      }
      transition={{
        duration: 0.3,
        delay: 0,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link href={linkDate ? `/movies/${movie.slug}?date=${linkDate}` : `/movies/${movie.slug}`} className="group block">
        <SpotlightCard className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden bg-secondary">
            <SafeImage
              src={movie.posterUrl}
              alt={movie.title}
              fill
              noBackdrop={!movie.backdropUrl}
              className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Info */}
          <div className="p-3">
            <div className="flex items-center gap-1.5">
              <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200 flex-1 min-w-0">
                {movie.title}
              </h3>
              <Badge className="bg-primary/20 text-primary text-[9px] px-1.5 py-0 border-0 font-semibold shrink-0">
                {movie.rating}
              </Badge>
            </div>
            {movie.titleKh && (
              <p className="font-[family-name:var(--font-khmer)] text-xs text-muted-foreground mt-0.5 truncate">
                {movie.titleKh}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              {movie.duration > 0 && (
                <>
                  <Clock className="w-3 h-3" />
                  <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}min</span>
                  <span className="text-border">|</span>
                </>
              )}
              <span>{movie.genre[0]}</span>
              <span className="text-border">|</span>
              <span className="text-[10px]">{movie.subtitleLang}</span>
            </div>

            {/* Showtimes */}
            {todayShowtimes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {todayShowtimes.slice(0, 3).map((st) => (
                  <span
                    key={st.id}
                    className="text-[11px] font-[family-name:var(--font-mono)] px-2 py-1 bg-secondary rounded-md text-foreground border border-border hover:border-primary hover:text-primary transition-colors duration-200"
                  >
                    {st.time}
                  </span>
                ))}
                {todayShowtimes.length > 3 && (
                  <span className="text-[11px] px-2 py-1 text-muted-foreground">
                    +{todayShowtimes.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Vote button for coming soon movies */}
            {showVotes && (
              <div className="mt-3">
                <VoteButton movieId={movie.id} />
              </div>
            )}
          </div>
        </SpotlightCard>
      </Link>
    </motion.div>
  );
}, (prev, next) => {
  return prev.movie.id === next.movie.id
    && prev.showtimes?.length === next.showtimes?.length
    && prev.showVotes === next.showVotes
    && prev.linkDate === next.linkDate;
});
