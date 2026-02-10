"use client";

import { motion } from "framer-motion";
import { DollarSign, Ticket, UserCheck, TrendingUp, Film } from "lucide-react";
import {
  movies,
  bookings,
  revenueData,
  getMovieById,
  formatPrice,
  timeAgo,
} from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const todayRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const weekRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const monthRevenue = weekRevenue * 3.8;
  const ticketsSold = bookings.filter((b) => b.status === "confirmed").length;
  const checkedIn = bookings.filter((b) => b.checkedIn).length;

  const stats = [
    { label: "Today's Revenue", value: formatPrice(todayRevenue), change: "+12%", icon: DollarSign, color: "text-gold" },
    { label: "Tickets Sold", value: String(ticketsSold), change: "+8%", icon: Ticket, color: "text-success" },
    { label: "Check-ins", value: String(checkedIn), change: "+5%", icon: UserCheck, color: "text-warm-muted" },
    { label: "Weekly Revenue", value: formatPrice(weekRevenue), change: "+15%", icon: TrendingUp, color: "text-gold-dark" },
  ];

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  // Top movies by bookings
  const movieBookingCounts: Record<string, number> = {};
  bookings.forEach((b) => {
    if (b.status === "confirmed") {
      movieBookingCounts[b.movieId] = (movieBookingCounts[b.movieId] || 0) + b.totalPrice;
    }
  });
  const topMovies = Object.entries(movieBookingCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, rev]) => ({ movie: getMovieById(id), revenue: rev }));

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-warm-black mb-6">
        Dashboard
      </h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-cream-light border border-warm-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-[10px] font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">
                {stat.change}
              </span>
            </div>
            <div className="font-[family-name:var(--font-mono)] text-xl font-bold text-warm-black">
              {stat.value}
            </div>
            <div className="text-xs text-warm-muted mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Revenue chart */}
        <div className="lg:col-span-3 bg-cream-light border border-warm-border rounded-xl p-5">
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-warm-black mb-4">
            Revenue Trend (7 Days)
          </h2>
          <div className="flex items-end justify-between gap-2 h-40">
            {revenueData.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-[family-name:var(--font-mono)] text-warm-muted">
                  ${d.revenue}
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="w-full bg-gold/80 rounded-t-md min-h-[4px] hover:bg-gold transition-colors"
                />
                <span className="text-[10px] text-warm-muted font-medium">{d.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top movies */}
        <div className="lg:col-span-2 bg-cream-light border border-warm-border rounded-xl p-5">
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-warm-black mb-4">
            Top Movies
          </h2>
          <div className="space-y-3">
            {topMovies.map(({ movie, revenue }, i) => (
              movie && (
                <div key={movie.id} className="flex items-center gap-3">
                  <span className="text-xs font-[family-name:var(--font-mono)] text-warm-tertiary w-4">
                    {i + 1}.
                  </span>
                  <Film className="w-4 h-4 text-gold shrink-0" />
                  <span className="text-sm text-warm-black flex-1 truncate">{movie.title}</span>
                  <span className="text-xs font-[family-name:var(--font-mono)] text-gold-dark font-medium">
                    {formatPrice(revenue)}
                  </span>
                </div>
              )
            ))}
            {topMovies.length === 0 && (
              <p className="text-sm text-warm-muted">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="bg-cream-light border border-warm-border rounded-xl p-5">
        <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-warm-black mb-4">
          Recent Bookings
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-border">
                <th className="text-left py-2 text-xs text-warm-muted font-medium">Invoice</th>
                <th className="text-left py-2 text-xs text-warm-muted font-medium">Movie</th>
                <th className="text-left py-2 text-xs text-warm-muted font-medium">Seats</th>
                <th className="text-left py-2 text-xs text-warm-muted font-medium">Amount</th>
                <th className="text-left py-2 text-xs text-warm-muted font-medium">Method</th>
                <th className="text-left py-2 text-xs text-warm-muted font-medium">Status</th>
                <th className="text-right py-2 text-xs text-warm-muted font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((booking) => {
                const movie = getMovieById(booking.movieId);
                return (
                  <tr key={booking.id} className="border-b border-warm-border/50">
                    <td className="py-2.5 font-[family-name:var(--font-mono)] text-xs text-warm-dark">
                      {booking.invoiceNumber.split("-").pop()}
                    </td>
                    <td className="py-2.5 text-warm-black">{movie?.title || "Unknown"}</td>
                    <td className="py-2.5 font-[family-name:var(--font-mono)] text-xs text-warm-muted">
                      {booking.seats.join(", ")}
                    </td>
                    <td className="py-2.5 font-[family-name:var(--font-mono)] text-warm-black font-medium">
                      {formatPrice(booking.totalPrice)}
                    </td>
                    <td className="py-2.5 capitalize text-warm-muted text-xs">{booking.paymentMethod}</td>
                    <td className="py-2.5">
                      <Badge
                        className={`text-[10px] border-0 ${
                          booking.status === "confirmed"
                            ? "bg-success/10 text-success"
                            : booking.status === "pending"
                            ? "bg-warning/10 text-warning"
                            : "bg-error/10 text-error"
                        }`}
                      >
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right text-xs text-warm-muted">
                      {timeAgo(booking.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
