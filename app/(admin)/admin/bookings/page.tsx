"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { bookings, getMovieById, getShowtimeById, formatPrice, timeAgo } from "@/lib/mock-data";

export default function AdminBookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = bookings.filter((b) => {
    const movie = getMovieById(b.movieId);
    const matchesSearch =
      !search ||
      b.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone.includes(search) ||
      movie?.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    confirmed: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    cancelled: "bg-error/10 text-error",
  };

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-warm-black mb-6">
        Bookings
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-muted" />
          <Input
            placeholder="Search by invoice, phone, or movie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-cream-light border-warm-border"
          />
        </div>
        <div className="flex gap-2">
          {["all", "confirmed", "pending", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition border capitalize ${
                statusFilter === status
                  ? "bg-gold/20 border-gold text-gold-dark"
                  : "border-warm-border text-warm-muted hover:border-gold/50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings table */}
      <div className="bg-cream-light border border-warm-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-border bg-cream-dark/50">
                <th className="text-left py-3 px-4 text-xs text-warm-muted font-medium">Invoice</th>
                <th className="text-left py-3 px-4 text-xs text-warm-muted font-medium">Movie</th>
                <th className="text-left py-3 px-4 text-xs text-warm-muted font-medium hidden sm:table-cell">Seats</th>
                <th className="text-left py-3 px-4 text-xs text-warm-muted font-medium hidden md:table-cell">Customer</th>
                <th className="text-left py-3 px-4 text-xs text-warm-muted font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-xs text-warm-muted font-medium hidden sm:table-cell">Payment</th>
                <th className="text-left py-3 px-4 text-xs text-warm-muted font-medium">Status</th>
                <th className="text-right py-3 px-4 text-xs text-warm-muted font-medium hidden lg:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => {
                const movie = getMovieById(booking.movieId);
                const showtime = getShowtimeById(booking.showtimeId);
                return (
                  <tr key={booking.id} className="border-b border-warm-border/50 hover:bg-cream-dark/30 transition">
                    <td className="py-3 px-4">
                      <div className="font-[family-name:var(--font-mono)] text-xs text-warm-black font-medium">
                        {booking.invoiceNumber}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-warm-black font-medium">{movie?.title || "Unknown"}</div>
                      {showtime && (
                        <div className="text-[10px] text-warm-muted">
                          {showtime.date} &bull; {showtime.time}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {booking.seats.map((seat) => (
                          <span
                            key={seat}
                            className="text-[10px] font-[family-name:var(--font-mono)] px-1.5 py-0.5 bg-cream-dark rounded font-medium text-warm-dark"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="text-xs text-warm-black">{booking.customerPhone}</div>
                      {booking.customerEmail && (
                        <div className="text-[10px] text-warm-muted">{booking.customerEmail}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-[family-name:var(--font-mono)] text-warm-black font-medium">
                      {formatPrice(booking.totalPrice)}
                      {booking.discount > 0 && (
                        <span className="text-[10px] text-success ml-1">
                          (-{formatPrice(booking.discount)})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 capitalize text-warm-muted text-xs hidden sm:table-cell">
                      {booking.paymentMethod}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`text-[10px] border-0 ${statusColors[booking.status]}`}>
                        {booking.status}
                      </Badge>
                      {booking.checkedIn && (
                        <Badge className="text-[10px] border-0 bg-gold/10 text-gold-dark ml-1">
                          checked in
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-warm-muted hidden lg:table-cell">
                      {timeAgo(booking.createdAt)}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-warm-muted text-sm">
                    No bookings found
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
