"use client";

import { motion } from "framer-motion";
import { DollarSign, Ticket, UserCheck, TrendingUp, Film, Heart } from "lucide-react";
import { formatPrice } from "@/lib/mock-data";
import { useCinemaStore, getStoreMovieById } from "@/lib/cinema-store";
import { Badge } from "@/components/ui/badge";
import { NumberTicker } from "@/components/ui/number-ticker";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { useI18n } from "@/lib/i18n";

export default function AdminDashboardPage() {
  const { t, locale } = useI18n();
  const storeMovies = useCinemaStore((s) => s.movies);
  const storeShowtimes = useCinemaStore((s) => s.showtimes);
  const votes = useCinemaStore((s) => s.votes);
  const hasHydrated = useCinemaStore((s) => s._hasHydrated);

  // Derive stats from store showtimes
  const today = new Date().toISOString().split("T")[0];

  const totalTickets = storeShowtimes.reduce((sum, st) => sum + st.bookedSeats.length, 0);
  const todayShowtimes = storeShowtimes.filter((st) => st.date === today);
  const todayRevenue = todayShowtimes.reduce((sum, st) => sum + st.bookedSeats.length * st.price, 0);

  // Weekly revenue chart — last 7 days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const weeklyRevenueData = weekDays.map((date) => {
    const dayShowtimes = storeShowtimes.filter((st) => st.date === date);
    const revenue = dayShowtimes.reduce((sum, st) => sum + st.bookedSeats.length * st.price, 0);
    const tickets = dayShowtimes.reduce((sum, st) => sum + st.bookedSeats.length, 0);
    const d = new Date(date + "T00:00:00");
    const label = d.toLocaleDateString(locale === "zh" ? "zh" : locale === "km" ? "km" : "en", { weekday: "short" });
    return { date: label, revenue, tickets };
  });

  const weekRevenue = weeklyRevenueData.reduce((sum, d) => sum + d.revenue, 0);
  const maxRevenue = Math.max(...weeklyRevenueData.map((d) => d.revenue), 1);

  const stats = [
    { label: t("admin.todayRevenue"), value: todayRevenue, prefix: "$", decimals: 2, icon: DollarSign, color: "text-primary" },
    { label: t("admin.ticketsSold"), value: totalTickets, prefix: "", decimals: 0, icon: Ticket, color: "text-success" },
    { label: t("admin.totalMovies"), value: storeMovies.length, prefix: "", decimals: 0, icon: Film, color: "text-muted-foreground" },
    { label: t("admin.weeklyRevenue"), value: weekRevenue, prefix: "$", decimals: 2, icon: TrendingUp, color: "text-primary" },
  ];

  // Top movies by revenue from store showtimes
  const movieRevMap: Record<string, number> = {};
  storeShowtimes.forEach((st) => {
    movieRevMap[st.movieId] = (movieRevMap[st.movieId] || 0) + st.bookedSeats.length * st.price;
  });
  const topMovies = Object.entries(movieRevMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, rev]) => ({ movie: getStoreMovieById(storeMovies, id), revenue: rev }));

  // Most voted movies — top 5 regardless of showtime status
  const topVoted = storeMovies
    .map((m) => ({ movie: m, voteCount: votes[m.id] || 0 }))
    .filter((m) => m.voteCount > 0)
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 5);

  // Recent activity — showtimes with bookings, sorted by date
  const recentActivity = storeShowtimes
    .filter((st) => st.bookedSeats.length > 0)
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
    .slice(0, 5);

  return (
    <div>
      {!hasHydrated && (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {hasHydrated && (
        <>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-6">
            {t("admin.dashboard")}
          </h1>

          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
              >
                <SpotlightCard className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    <span>{stat.value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {/* Revenue chart */}
            <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
              <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-foreground mb-4">
                {t("admin.revenueTrend")}
              </h2>
              <div className="flex items-end justify-between gap-2 h-48 pt-6">
                {weeklyRevenueData.map((d, i) => (
                  <div key={d.date} className="flex-1 flex flex-col h-full group">
                    {/* Value Label */}
                    <div className="h-6 flex items-center justify-center mb-1">
                      <motion.span
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[9px] font-[family-name:var(--font-mono)] text-muted-foreground group-hover:text-primary transition-colors font-medium"
                      >
                        {d.revenue > 0 ? `$${d.revenue.toFixed(0)}` : "—"}
                      </motion.span>
                    </div>

                    {/* Bar Container */}
                    <div className="flex-1 relative flex items-end px-0.5">
                      <div
                        style={{ height: `${maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0}%` }}
                        className="w-full bg-amber-600 rounded-t-sm hover:bg-amber-500 transition-colors relative overflow-hidden group-hover:shadow-[0_0_10px_rgba(217,119,6,0.2)]"
                      />
                    </div>

                    {/* Date Label */}
                    <div className="h-6 flex items-center justify-center mt-2">
                      <span className="text-[10px] text-muted-foreground font-medium group-hover:text-foreground transition-colors">{d.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top movies */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
              <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-foreground mb-4">
                {t("admin.topMovies")}
              </h2>
              <div className="space-y-3">
                {topMovies.map(({ movie, revenue }, i) => (
                  movie && (
                    <div key={movie.id} className="flex items-center gap-3">
                      <span className="text-xs font-[family-name:var(--font-mono)] text-muted-foreground w-4">
                        {i + 1}.
                      </span>
                      <Film className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm text-foreground flex-1 truncate">{movie.title}</span>
                      <span className="text-xs font-[family-name:var(--font-mono)] text-primary font-medium">
                        {formatPrice(revenue)}
                      </span>
                    </div>
                  )
                ))}
                {topMovies.length === 0 && (
                  <p className="text-sm text-muted-foreground">{t("admin.noData")}</p>
                )}
              </div>
            </div>
          </div>

          {/* Most Voted */}
          {topVoted.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-primary" />
                <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-foreground">
                  {t("admin.mostVoted")}
                </h2>
              </div>
              <div className="space-y-3">
                {topVoted.map(({ movie, voteCount }, i) => (
                  <div key={movie.id} className="flex items-center gap-3">
                    <span className="text-xs font-[family-name:var(--font-mono)] text-muted-foreground w-4">
                      {i + 1}.
                    </span>
                    <Heart className="w-4 h-4 text-primary shrink-0 fill-primary" />
                    <span className="text-sm text-foreground flex-1 truncate">{movie.title}</span>
                    <Badge className="text-[10px] border-0 bg-primary/10 text-primary">
                      {movie.status === "now_showing" ? t("admin.showing") : movie.status === "coming_soon" ? t("admin.upcoming") : t("admin.hidden")}
                    </Badge>
                    <span className="text-xs font-[family-name:var(--font-mono)] text-primary font-medium">
                      {voteCount} votes
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-foreground mb-4">
              {t("admin.recentActivity")}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">{t("admin.movie")}</th>
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">{t("common.date")}</th>
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">{t("common.time")}</th>
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">{t("admin.seatsBooked")}</th>
                    <th className="text-right py-2 text-xs text-muted-foreground font-medium">{t("admin.revenue")}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((st) => {
                    const movie = getStoreMovieById(storeMovies, st.movieId);
                    return (
                      <tr key={st.id} className="border-b border-border/50">
                        <td className="py-2.5 text-foreground">{movie?.title || "Unknown"}</td>
                        <td className="py-2.5 font-[family-name:var(--font-mono)] text-xs text-muted-foreground">
                          {st.date}
                        </td>
                        <td className="py-2.5 font-[family-name:var(--font-mono)] text-xs text-muted-foreground">
                          {st.time}
                        </td>
                        <td className="py-2.5 font-[family-name:var(--font-mono)] text-xs text-muted-foreground">
                          {st.bookedSeats.length} / {st.totalSeats}
                        </td>
                        <td className="py-2.5 text-right font-[family-name:var(--font-mono)] text-foreground font-medium">
                          {formatPrice(st.bookedSeats.length * st.price)}
                        </td>
                      </tr>
                    );
                  })}
                  {recentActivity.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                        {t("admin.noBookings")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
