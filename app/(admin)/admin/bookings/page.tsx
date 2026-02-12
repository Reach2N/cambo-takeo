"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/mock-data";
import { useCinemaStore, getStoreMovieById } from "@/lib/cinema-store";
import { useI18n } from "@/lib/i18n";

export default function AdminBookingsPage() {
  const storeMovies = useCinemaStore((s) => s.movies);
  const storeShowtimes = useCinemaStore((s) => s.showtimes);
  const { t } = useI18n();

  const [search, setSearch] = useState("");

  // Derive bookings from showtimes that have bookedSeats
  const bookingRows = storeShowtimes
    .filter((st) => st.bookedSeats.length > 0)
    .map((st) => {
      const movie = getStoreMovieById(storeMovies, st.movieId);
      return {
        id: st.id,
        movieTitle: movie?.title || "Unknown",
        date: st.date,
        time: st.time,
        seatsBooked: st.bookedSeats.length,
        price: st.price,
        total: st.bookedSeats.length * st.price,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  const filtered = bookingRows.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.movieTitle.toLowerCase().includes(q) ||
      b.date.includes(q) ||
      b.time.includes(q)
    );
  });

  const totalRevenue = filtered.reduce((sum, b) => sum + b.total, 0);
  const totalSeats = filtered.reduce((sum, b) => sum + b.seatsBooked, 0);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-6">
        {t("admin.bookings")}
      </h1>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("admin.searchBookings")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-xl font-bold text-foreground font-[family-name:var(--font-mono)]">{filtered.length}</div>
          <div className="text-xs text-muted-foreground">{t("admin.showtimesWithBookings")}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-xl font-bold text-foreground font-[family-name:var(--font-mono)]">{totalSeats}</div>
          <div className="text-xs text-muted-foreground">{t("admin.totalSeatsBooked")}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-xl font-bold text-primary font-[family-name:var(--font-mono)]">{formatPrice(totalRevenue)}</div>
          <div className="text-xs text-muted-foreground">{t("admin.totalRevenue")}</div>
        </div>
      </div>

      {/* Bookings table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">{t("admin.movie")}</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">{t("common.date")}</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden sm:table-cell">{t("common.time")}</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">{t("common.seats")}</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden sm:table-cell">{t("admin.price")}</th>
                <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">{t("common.total")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => (
                <tr key={booking.id} className="border-b border-border/50 hover:bg-secondary/30 transition">
                  <td className="py-3 px-4">
                    <div className="text-foreground font-medium">{booking.movieTitle}</div>
                  </td>
                  <td className="py-3 px-4 font-[family-name:var(--font-mono)] text-xs text-muted-foreground">
                    {booking.date}
                  </td>
                  <td className="py-3 px-4 font-[family-name:var(--font-mono)] text-xs text-muted-foreground hidden sm:table-cell">
                    {booking.time}
                  </td>
                  <td className="py-3 px-4">
                    <Badge className="text-[10px] border-0 bg-primary/10 text-primary">
                      {booking.seatsBooked} {t("common.seats")}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-[family-name:var(--font-mono)] text-xs text-muted-foreground hidden sm:table-cell">
                    {formatPrice(booking.price)}
                  </td>
                  <td className="py-3 px-4 text-right font-[family-name:var(--font-mono)] text-foreground font-medium">
                    {formatPrice(booking.total)}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                    {t("admin.noBookingsFound")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
