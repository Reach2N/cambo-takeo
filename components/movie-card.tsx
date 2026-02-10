"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Movie, Showtime } from "@/lib/mock-data";
import { useRef } from "react";

interface MovieCardProps {
  movie: Movie;
  showtimes?: Showtime[];
  index?: number;
}

export function MovieCard({ movie, showtimes = [], index = 0 }: MovieCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const todayShowtimes = showtimes.filter((s) => {
    const today = new Date().toISOString().split("T")[0];
    return s.date === today;
  });

  const rating = movie.voteAverage ?? 0;
  const ratingStars = Math.round(rating / 2);

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
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link href={`/movies/${movie.slug}`} className="group block">
        <div className="bg-cream-light border border-warm-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden bg-cream-dark">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-warm-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex gap-1.5">
              <Badge className="bg-warm-black/80 text-cream text-[10px] px-1.5 py-0.5 border-0 backdrop-blur-sm">
                {movie.subtitleLang}
              </Badge>
              <Badge className="bg-gold/90 text-warm-black text-[10px] px-1.5 py-0.5 border-0 font-semibold">
                {movie.rating}
              </Badge>
            </div>

            {/* TMDB rating on hover */}
            {rating > 0 && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-warm-black/70 backdrop-blur-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-1 group-hover:translate-y-0">
                <Star className="w-3 h-3 fill-gold text-gold" />
                <span className="text-xs font-[family-name:var(--font-mono)] font-medium text-cream-light">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-warm-black truncate group-hover:text-gold-dark transition-colors duration-200">
              {movie.title}
            </h3>
            {movie.titleKh && (
              <p className="font-[family-name:var(--font-khmer)] text-xs text-warm-muted mt-0.5 truncate">
                {movie.titleKh}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2 text-xs text-warm-muted">
              {movie.duration > 0 && (
                <>
                  <Clock className="w-3 h-3" />
                  <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}min</span>
                  <span className="text-warm-border">|</span>
                </>
              )}
              <span>{movie.genre[0]}</span>
            </div>

            {/* Rating stars */}
            <div className="flex gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 transition-colors duration-300 ${
                    star <= ratingStars
                      ? "fill-gold text-gold"
                      : "text-warm-border"
                  }`}
                />
              ))}
            </div>

            {/* Showtimes */}
            {todayShowtimes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {todayShowtimes.slice(0, 3).map((st) => (
                  <span
                    key={st.id}
                    className="text-[11px] font-[family-name:var(--font-mono)] px-2 py-1 bg-cream-dark rounded-md text-warm-dark border border-warm-border hover:border-gold hover:text-gold-dark transition-colors duration-200"
                  >
                    {st.time}
                  </span>
                ))}
                {todayShowtimes.length > 3 && (
                  <span className="text-[11px] px-2 py-1 text-warm-muted">
                    +{todayShowtimes.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
