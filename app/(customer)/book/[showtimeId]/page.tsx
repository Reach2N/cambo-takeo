"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeatPicker } from "@/components/seat-picker";
import {
  getShowtimeById,
  getMovieById,
  formatDate,
  formatPrice,
} from "@/lib/mock-data";
import { useState, useEffect } from "react";

export default function SeatSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const showtime = getShowtimeById(params.showtimeId as string);
  const movie = showtime ? getMovieById(showtime.movieId) : null;
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!showtime || !movie) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-warm-black mb-2">
            Showtime Not Found
          </h1>
          <Link href="/" className="text-gold hover:text-gold-dark text-sm font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleSeatToggle = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const total = selectedSeats.length * showtime.price;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-16 z-30 bg-cream/95 backdrop-blur-sm border-b border-warm-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/movies/${movie.slug}`}
            className="flex items-center gap-1 text-sm text-warm-dark hover:text-gold transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className={`flex items-center gap-1.5 text-sm font-[family-name:var(--font-mono)] font-medium ${timeLeft < 30 ? "text-error" : "text-warm-muted"}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Progress stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["Select Seats", "Payment", "Confirmation"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 ${i === 0 ? "text-gold font-medium" : "text-warm-tertiary"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  i === 0 ? "bg-gold text-warm-black" : "bg-cream-dark text-warm-tertiary"
                }`}>
                  {i + 1}
                </div>
                <span className="text-xs hidden sm:inline">{step}</span>
              </div>
              {i < 2 && <div className="w-8 sm:w-16 h-px bg-warm-border" />}
            </div>
          ))}
        </div>

        {/* Movie info */}
        <div className="text-center mb-6">
          <h1 className="font-[family-name:var(--font-display)] text-xl font-bold text-warm-black">
            {movie.title}
          </h1>
          <p className="text-sm text-warm-muted mt-1">
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
          className="mt-6 bg-cream-light border border-warm-border rounded-xl p-4 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-sm text-warm-muted">Selected Seats</div>
              {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedSeats.sort().map((seat) => (
                    <span
                      key={seat}
                      className="text-xs font-[family-name:var(--font-mono)] px-2 py-0.5 bg-gold/20 text-gold-dark rounded font-medium"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-warm-tertiary mt-1">Tap seats to select</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-warm-muted">Total</div>
                <div className="font-[family-name:var(--font-mono)] text-xl font-bold text-warm-black">
                  {formatPrice(total)}
                </div>
              </div>
              <Button
                disabled={selectedSeats.length === 0}
                onClick={() => router.push(`/book/${params.showtimeId}/pay?seats=${selectedSeats.join(",")}`)}
                className="bg-gold hover:bg-gold-light text-warm-black font-semibold px-6 shadow-lg shadow-gold/20 disabled:opacity-40 disabled:shadow-none"
              >
                <Ticket className="w-4 h-4 mr-2" />
                Continue
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
