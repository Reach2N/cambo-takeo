"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Download, Calendar, Share2, QrCode, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  formatDate,
  formatPrice,
} from "@/lib/mock-data";
import { useCinemaStore, getStoreMovieById } from "@/lib/cinema-store";
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";

export default function SuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const seats = searchParams.get("seats")?.split(",") || [];
  const total = parseFloat(searchParams.get("total") || "0");
  const { t } = useI18n();

  const showtimes = useCinemaStore((s) => s.showtimes);
  const movies = useCinemaStore((s) => s.movies);

  const showtime = showtimes.find((s) => s.id === params.showtimeId);
  const movie = showtime ? getStoreMovieById(movies, showtime.movieId) : null;

  const invoiceNumber = `INV-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 pt-24">
      {/* Progress stepper - step 3 active */}
      <div className="flex items-center justify-center gap-2 mb-8 w-full max-w-md">
        {[t("booking.step1"), t("booking.step2"), t("booking.step3")].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 ${i <= 2 ? (i === 2 ? "text-primary font-medium" : "text-success") : "text-muted-foreground"}`}>
              <motion.div
                initial={i === 2 ? { scale: 0 } : undefined}
                animate={i === 2 ? { scale: 1 } : undefined}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${i < 2 ? "bg-success text-white" : "bg-primary text-primary-foreground"
                  }`}
              >
                {i < 2 ? "✓" : "✓"}
              </motion.div>
              <span className="text-xs hidden sm:inline">{step}</span>
            </div>
            {i < 2 && <div className="w-8 sm:w-16 h-px bg-success" />}
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >

        {/* E-Ticket */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
          {/* QR Code */}
          <div className="bg-foreground p-6 flex flex-col items-center">
            <div className="w-40 h-40 bg-background rounded-xl flex items-center justify-center">
              <QrCode className="w-24 h-24 text-foreground" />
            </div>
            <p className="font-[family-name:var(--font-mono)] text-xs text-muted-foreground mt-3">
              {invoiceNumber}
            </p>
          </div>

          {/* Ticket details */}
          <div className="p-5">
            {movie && showtime && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Ticket className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
                      {movie.title}
                    </h3>
                    {movie.titleKh && (
                      <p className="font-[family-name:var(--font-khmer)] text-xs text-muted-foreground">
                        {movie.titleKh}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide block">{t("common.date")}</span>
                    <span className="text-foreground font-medium">{formatDate(showtime.date)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide block">{t("common.time")}</span>
                    <span className="font-[family-name:var(--font-mono)] text-foreground font-medium">{showtime.time}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide block">{t("common.seats")}</span>
                    <div className="flex flex-wrap gap-1">
                      {seats.map((seat) => (
                        <span
                          key={seat}
                          className="text-xs font-[family-name:var(--font-mono)] px-1.5 py-0.5 bg-primary/20 text-primary rounded font-medium"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide block">{t("success.totalPaid")}</span>
                    <span className="font-[family-name:var(--font-mono)] text-foreground font-bold text-lg">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dashed line */}
          <div className="relative">
            <div className="absolute left-0 top-0 w-4 h-4 bg-background rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute right-0 top-0 w-4 h-4 bg-background rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="border-t-2 border-dashed border-border mx-4" />
          </div>

          {/* Actions */}
          <div className="p-4 flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => toast.info(t("success.downloadSoon"))}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              {t("success.download")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => toast.info(t("success.calendarSoon"))}
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              {t("success.calendar")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.success(t("success.linkCopied"));
              }}
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              {t("success.share")}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          {t("success.showQR")}
        </p>

        {/* Book another */}
        <Link href="/" className="block mt-6">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20">
            {t("success.bookAnother")}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
