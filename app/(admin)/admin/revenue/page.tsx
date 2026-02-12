"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Ticket } from "lucide-react";
import { formatPrice } from "@/lib/mock-data";
import { useCinemaStore, getStoreMovieById } from "@/lib/cinema-store";
import { useI18n } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";

export default function AdminRevenuePage() {
  const storeMovies = useCinemaStore((s) => s.movies);
  const storeShowtimes = useCinemaStore((s) => s.showtimes);
  const { t } = useI18n();

  // Calculate all revenue from store showtimes
  const totalRevenue = storeShowtimes.reduce(
    (sum, st) => sum + st.bookedSeats.length * st.price,
    0
  );
  const totalTickets = storeShowtimes.reduce(
    (sum, st) => sum + st.bookedSeats.length,
    0
  );
  const avgTicketPrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;

  // Today's revenue
  const today = new Date().toISOString().split("T")[0];
  const todayRevenue = storeShowtimes
    .filter((st) => st.date === today)
    .reduce((sum, st) => sum + st.bookedSeats.length * st.price, 0);

  // Weekly revenue chart — last 7 days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const weeklyData = weekDays.map((date) => {
    const dayShowtimes = storeShowtimes.filter((st) => st.date === date);
    const revenue = dayShowtimes.reduce((sum, st) => sum + st.bookedSeats.length * st.price, 0);
    const tickets = dayShowtimes.reduce((sum, st) => sum + st.bookedSeats.length, 0);
    const d = new Date(date + "T00:00:00");
    const label = d.toLocaleDateString("en", { weekday: "short" });
    return { date: label, revenue, tickets };
  });

  const weekRevenue = weeklyData.reduce((sum, d) => sum + d.revenue, 0);
  const maxRevenue = Math.max(...weeklyData.map((d) => d.revenue), 1);

  // Revenue by movie
  const movieRevenue: Record<string, number> = {};
  const movieTickets: Record<string, number> = {};
  storeShowtimes.forEach((st) => {
    movieRevenue[st.movieId] = (movieRevenue[st.movieId] || 0) + st.bookedSeats.length * st.price;
    movieTickets[st.movieId] = (movieTickets[st.movieId] || 0) + st.bookedSeats.length;
  });
  const movieRevenueList = Object.entries(movieRevenue)
    .map(([id, rev]) => ({ movie: getStoreMovieById(storeMovies, id), revenue: rev, tickets: movieTickets[id] || 0 }))
    .filter((x) => x.movie)
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-6">
        {t("admin.revenueReports")}
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: t("common.today"), value: formatPrice(todayRevenue), icon: DollarSign },
          { label: t("admin.thisWeek"), value: formatPrice(weekRevenue), icon: TrendingUp },
          { label: t("admin.totalRevenue"), value: formatPrice(totalRevenue), icon: DollarSign },
          { label: t("admin.avgTicket"), value: formatPrice(avgTicketPrice), icon: Ticket },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <stat.icon className="w-5 h-5 text-primary mb-2" />
            <div className="font-[family-name:var(--font-mono)] text-xl font-bold text-foreground">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="bg-card border border-border rounded-xl p-5 mb-8">
        <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-foreground mb-4">
          {t("admin.weeklyRevenue")}
        </h2>
        <div className="flex items-end justify-between gap-2 h-56 pt-8">
          {weeklyData.map((d, i) => (
            <div key={d.date} className="flex-1 flex flex-col h-full group">
              {/* Value Label */}
              <div className="h-6 flex flex-col items-center justify-center mb-2">
                <span className="text-[9px] font-[family-name:var(--font-mono)] text-muted-foreground group-hover:text-primary transition-colors font-medium">
                  {d.revenue > 0 ? `$${d.revenue.toFixed(0)}` : "—"}
                </span>
                {d.revenue > 0 && (
                  <span className="text-[8px] text-muted-foreground/60 group-hover:block hidden">
                    {d.tickets} tix
                  </span>
                )}
              </div>

              {/* Bar Area */}
              <div className="flex-1 relative flex items-end px-1">
                <div
                  style={{ height: `${maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0}%` }}
                  className="w-full bg-amber-600 rounded-t-lg min-h-[4px] hover:bg-amber-500 transition-colors relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(217,119,6,0.25)]"
                />
              </div>

              {/* Labels Footer */}
              <div className="mt-3 flex flex-col items-center">
                <span className="text-[11px] text-muted-foreground font-semibold group-hover:text-foreground transition-colors uppercase tracking-tight">
                  {d.date}
                </span>
                <span className="text-[9px] text-muted-foreground/50 font-medium">
                  {d.tickets} {t("admin.tickets")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by movie */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-foreground mb-4">
          {t("admin.revenueByMovie")}
        </h2>
        <div className="space-y-4">
          {(() => {
            const maxMovieRev = Math.max(...movieRevenueList.map((m) => m.revenue), 1);
            return movieRevenueList.map(({ movie, revenue, tickets }, i) => {
              const pct = maxMovieRev > 0 ? (revenue / maxMovieRev) * 100 : 0;
              const totalPct = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
              return movie ? (
                <div key={movie.id} className="flex items-center gap-3">
                  <span className="text-xs font-[family-name:var(--font-mono)] text-muted-foreground w-4 shrink-0">
                    {i + 1}.
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground font-medium">{movie.title}</span>
                        {i === 0 && revenue > 0 && (
                          <Badge className="text-[9px] h-4 px-1 bg-primary/10 text-primary border-0">Top</Badge>
                        )}
                      </div>
                      <span className="font-[family-name:var(--font-mono)] text-sm text-primary font-medium">
                        {formatPrice(revenue)}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-amber-600 rounded-full relative"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>{tickets} tickets</span>
                      <span>{totalPct.toFixed(1)}% of total</span>
                    </div>
                  </div>
                </div>
              ) : null;
            });
          })()}
          {movieRevenueList.length === 0 && (
            <p className="text-sm text-muted-foreground">{t("admin.noRevenue")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
