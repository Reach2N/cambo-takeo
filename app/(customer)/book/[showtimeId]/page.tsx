"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeatPicker } from "@/components/seat-picker";
import { toast } from "sonner";
import {
  formatDate,
  formatPrice,
} from "@/lib/mock-data";
import { useCinemaStore, getStoreMovieById } from "@/lib/cinema-store";
import { isShowtimeUpcoming } from "@/lib/calendar-utils";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

export default function SeatSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();

  const showtimes = useCinemaStore((s) => s.showtimes);
  const movies = useCinemaStore((s) => s.movies);

  const showtime = showtimes.find((s) => s.id === params.showtimeId);
  const movie = showtime ? getStoreMovieById(movies, showtime.movieId) : null;

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes

  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error(t("booking.sessionExpired"));
      router.push("/");
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, router, t]);

  if (!showtime || !movie) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-2">
            {t("booking.showtimeNotFound")}
          </h1>
          <Link href="/" className="text-primary hover:text-primary/80 text-sm font-medium">
            {t("common.backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  const expired = !isShowtimeUpcoming(showtime.date, showtime.time);

  if (expired) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-2">
            {t("booking.showtimeExpired")}
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            {t("booking.showtimeExpiredDesc")}
          </p>
          <Link href="/" className="text-primary hover:text-primary/80 text-sm font-medium">
            {t("booking.browseMovies")}
          </Link>
        </div>
      </div>
    );
  }

  const handleSeatToggle = (seatId: string) => {
    setSelectedSeats((prev) => {
      const isSelected = prev.includes(seatId);
      if (isSelected) {
        return prev.filter((s) => s !== seatId);
      }
      if (prev.length >= 8) {
        toast.warning(t("booking.maxSeats"));
        return prev;
      }
      return [...prev, seatId];
    });
  };

  const total = selectedSeats.length * showtime.price;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen pt-24">
      {/* Top bar */}
      <div className="sticky top-24 z-30 bg-background/95 backdrop-blur-sm border-b border-border rounded-xl mx-4 mb-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/movies/${movie.slug}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition"
          >
            <ArrowLeft className="w-4 h-4" /> {t("common.back")}
          </Link>
          <div className={`flex items-center gap-1.5 text-sm font-[family-name:var(--font-mono)] font-medium ${timeLeft < 30 ? "text-destructive" : "text-muted-foreground"}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Progress stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[t("booking.step1"), t("booking.step2"), t("booking.step3")].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 ${i === 0 ? "text-primary font-medium" : "text-muted-foreground"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                <span className="text-xs hidden sm:inline">{step}</span>
              </div>
              {i < 2 && <div className="w-8 sm:w-16 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Movie info */}
        <div className="text-center mb-6">
          <h1 className="font-[family-name:var(--font-display)] text-xl font-bold text-foreground">
            {movie.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDate(showtime.date)} &bull; {showtime.time} &bull; {formatPrice(showtime.price)}/seat
          </p>
        </div>

        {/* Seat picker */}
        <SeatPicker
          bookedSeats={showtime.bookedSeats}
          selectedSeats={selectedSeats}
          onSeatToggle={handleSeatToggle}
        />

        {/* Bottom summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-6 bg-card border border-border rounded-xl p-4 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">{t("booking.selectedSeats")}</div>
              {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedSeats.sort().map((seat) => (
                    <span
                      key={seat}
                      className="text-xs font-[family-name:var(--font-mono)] px-2 py-0.5 bg-primary/20 text-primary rounded font-medium"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">{t("booking.tapToSelect")}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">{t("common.total")}</div>
                <div className="font-[family-name:var(--font-mono)] text-xl font-bold text-foreground">
                  {formatPrice(total)}
                </div>
              </div>
              <Button
                disabled={selectedSeats.length === 0}
                onClick={() => router.push(`/book/${params.showtimeId}/pay?seats=${selectedSeats.join(",")}`)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-lg shadow-primary/20 disabled:opacity-40 disabled:shadow-none"
              >
                <Ticket className="w-4 h-4 mr-2" />
                {t("booking.continue")}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
