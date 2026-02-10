"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Download, Calendar, Share2, QrCode, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getShowtimeById,
  getMovieById,
  formatDate,
  formatPrice,
} from "@/lib/mock-data";

export default function SuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const seats = searchParams.get("seats")?.split(",") || [];
  const total = parseFloat(searchParams.get("total") || "0");
  const showtime = getShowtimeById(params.showtimeId as string);
  const movie = showtime ? getMovieById(showtime.movieId) : null;

  const invoiceNumber = `INV-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Success icon */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="w-10 h-10 rounded-full bg-success flex items-center justify-center"
            >
              <Check className="w-6 h-6 text-cream" />
            </motion.div>
          </motion.div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-warm-black">
            Booking Confirmed!
          </h1>
          <p className="text-sm text-warm-muted mt-1">
            Your tickets have been booked successfully
          </p>
        </div>

        {/* E-Ticket */}
        <div className="bg-cream-light border border-warm-border rounded-2xl overflow-hidden shadow-lg">
          {/* QR Code */}
          <div className="bg-warm-black p-6 flex flex-col items-center">
            <div className="w-40 h-40 bg-cream rounded-xl flex items-center justify-center">
              <QrCode className="w-24 h-24 text-warm-black" />
            </div>
            <p className="font-[family-name:var(--font-mono)] text-xs text-warm-tertiary mt-3">
              {invoiceNumber}
            </p>
          </div>

          {/* Ticket details */}
          <div className="p-5">
            {movie && showtime && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Ticket className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-warm-black">
                      {movie.title}
                    </h3>
                    <p className="font-[family-name:var(--font-khmer)] text-xs text-warm-muted">
                      {movie.titleKh}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-[10px] text-warm-tertiary uppercase tracking-wide block">Date</span>
                    <span className="text-warm-black font-medium">{formatDate(showtime.date)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-warm-tertiary uppercase tracking-wide block">Time</span>
                    <span className="font-[family-name:var(--font-mono)] text-warm-black font-medium">{showtime.time}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-warm-tertiary uppercase tracking-wide block">Seats</span>
                    <div className="flex flex-wrap gap-1">
                      {seats.map((seat) => (
                        <span
                          key={seat}
                          className="text-xs font-[family-name:var(--font-mono)] px-1.5 py-0.5 bg-gold/20 text-gold-dark rounded font-medium"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-warm-tertiary uppercase tracking-wide block">Total Paid</span>
                    <span className="font-[family-name:var(--font-mono)] text-warm-black font-bold text-lg">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dashed line */}
          <div className="relative">
            <div className="absolute left-0 top-0 w-4 h-4 bg-cream rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute right-0 top-0 w-4 h-4 bg-cream rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="border-t-2 border-dashed border-warm-border mx-4" />
          </div>

          {/* Actions */}
          <div className="p-4 flex justify-center gap-3">
            <Button variant="outline" size="sm" className="text-xs border-warm-border hover:border-gold">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download
            </Button>
            <Button variant="outline" size="sm" className="text-xs border-warm-border hover:border-gold">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Calendar
            </Button>
            <Button variant="outline" size="sm" className="text-xs border-warm-border hover:border-gold">
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Share
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-center text-xs text-warm-muted mt-4">
          Show this QR code at the cinema entrance
        </p>

        {/* Book another */}
        <Link href="/" className="block mt-6">
          <Button className="w-full bg-gold hover:bg-gold-light text-warm-black font-semibold shadow-lg shadow-gold/20">
            Book Another Movie
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
