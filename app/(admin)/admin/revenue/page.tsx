"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Ticket, CreditCard, QrCode, Banknote } from "lucide-react";
import {
  bookings,
  revenueData,
  getMovieById,
  formatPrice,
} from "@/lib/mock-data";

export default function AdminRevenuePage() {
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");

  const todayRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const weekRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const monthRevenue = weekRevenue * 3.8;
  const totalTickets = revenueData.reduce((sum, d) => sum + d.tickets, 0);
  const avgTicketPrice = totalTickets > 0 ? weekRevenue / totalTickets : 0;

  // Revenue by movie
  const movieRevenue: Record<string, number> = {};
  confirmedBookings.forEach((b) => {
    movieRevenue[b.movieId] = (movieRevenue[b.movieId] || 0) + b.totalPrice;
  });
  const movieRevenueList = Object.entries(movieRevenue)
    .map(([id, rev]) => ({ movie: getMovieById(id), revenue: rev }))
    .filter((x) => x.movie)
    .sort((a, b) => b.revenue - a.revenue);

  // Revenue by payment method
  const methodRevenue: Record<string, number> = {};
  confirmedBookings.forEach((b) => {
    methodRevenue[b.paymentMethod] = (methodRevenue[b.paymentMethod] || 0) + b.totalPrice;
  });

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));
  const totalRevenue = confirmedBookings.reduce((s, b) => s + b.totalPrice, 0);

  const methodIcons: Record<string, typeof QrCode> = {
    bakong: QrCode,
    visa: CreditCard,
    cash: Banknote,
    wallet: DollarSign,
  };

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-warm-black mb-6">
        Revenue Reports
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today", value: formatPrice(todayRevenue), icon: DollarSign },
          { label: "This Week", value: formatPrice(weekRevenue), icon: TrendingUp },
          { label: "This Month", value: formatPrice(monthRevenue), icon: DollarSign },
          { label: "Avg Ticket", value: formatPrice(avgTicketPrice), icon: Ticket },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-cream-light border border-warm-border rounded-xl p-4"
          >
            <stat.icon className="w-5 h-5 text-gold mb-2" />
            <div className="font-[family-name:var(--font-mono)] text-xl font-bold text-warm-black">
              {stat.value}
            </div>
            <div className="text-xs text-warm-muted">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly chart */}
        <div className="bg-cream-light border border-warm-border rounded-xl p-5">
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-warm-black mb-4">
            Weekly Revenue
          </h2>
          <div className="flex items-end justify-between gap-2 h-48">
            {revenueData.map((d, i) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-[family-name:var(--font-mono)] text-warm-muted">
                  ${d.revenue}
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="w-full bg-gold/80 rounded-t-md min-h-[4px] hover:bg-gold transition-colors"
                />
                <span className="text-[10px] text-warm-muted font-medium">{d.date}</span>
                <span className="text-[9px] text-warm-tertiary">{d.tickets} tix</span>
              </div>
            ))}
          </div>
        </div>

        {/* By payment method */}
        <div className="bg-cream-light border border-warm-border rounded-xl p-5">
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-warm-black mb-4">
            By Payment Method
          </h2>
          <div className="space-y-4">
            {Object.entries(methodRevenue).map(([method, rev]) => {
              const Icon = methodIcons[method] || DollarSign;
              const pct = totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0;
              return (
                <div key={method}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gold" />
                      <span className="text-sm capitalize text-warm-black font-medium">{method}</span>
                    </div>
                    <span className="font-[family-name:var(--font-mono)] text-sm text-warm-black font-medium">
                      {formatPrice(rev)}
                    </span>
                  </div>
                  <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-gold rounded-full"
                    />
                  </div>
                  <div className="text-[10px] text-warm-muted mt-0.5">{pct.toFixed(0)}% of total</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Revenue by movie */}
      <div className="bg-cream-light border border-warm-border rounded-xl p-5">
        <h2 className="font-[family-name:var(--font-display)] text-base font-semibold text-warm-black mb-4">
          Revenue by Movie
        </h2>
        <div className="space-y-3">
          {movieRevenueList.map(({ movie, revenue }, i) => {
            const pct = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
            return movie ? (
              <div key={movie.id} className="flex items-center gap-3">
                <span className="text-xs font-[family-name:var(--font-mono)] text-warm-tertiary w-4 shrink-0">
                  {i + 1}.
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-warm-black font-medium">{movie.title}</span>
                    <span className="font-[family-name:var(--font-mono)] text-sm text-gold-dark font-medium">
                      {formatPrice(revenue)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="h-full bg-gold/70 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
