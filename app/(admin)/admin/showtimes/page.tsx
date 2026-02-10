"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  movies,
  showtimes as initialShowtimes,
  getMovieById,
  formatDate,
  formatPrice,
  type Showtime,
} from "@/lib/mock-data";

export default function AdminShowtimesPage() {
  const [showtimeList, setShowtimeList] = useState<Showtime[]>(initialShowtimes);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const [form, setForm] = useState({
    movieId: movies[0]?.id || "",
    date: new Date().toISOString().split("T")[0],
    time: "14:00",
    price: "4.00",
  });

  const filtered = showtimeList.filter((s) => s.date === selectedDate);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const handleAdd = () => {
    const newShowtime: Showtime = {
      id: String(Date.now()),
      movieId: form.movieId,
      date: form.date,
      time: form.time,
      price: parseFloat(form.price) || 4.0,
      totalSeats: 120,
      bookedSeats: [],
    };
    setShowtimeList((prev) => [...prev, newShowtime]);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setShowtimeList((prev) => prev.filter((s) => s.id !== id));
  };

  // Group by movie
  const groupedByMovie: Record<string, Showtime[]> = {};
  filtered.forEach((st) => {
    if (!groupedByMovie[st.movieId]) groupedByMovie[st.movieId] = [];
    groupedByMovie[st.movieId].push(st);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-warm-black">
          Showtimes
        </h1>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gold hover:bg-gold-light text-warm-black font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Showtime
        </Button>
      </div>

      {/* Date pills */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6">
        {dates.map((date) => {
          const d = new Date(date + "T00:00:00");
          const isSelected = date === selectedDate;
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`shrink-0 px-4 py-2 rounded-xl text-center transition-all border ${
                isSelected
                  ? "bg-gold text-warm-black border-gold font-semibold"
                  : "bg-cream-light border-warm-border text-warm-dark hover:border-gold"
              }`}
            >
              <div className="text-[10px] uppercase tracking-wide">
                {formatDate(date) === "Today" ? "Today" : d.toLocaleDateString("en", { weekday: "short" })}
              </div>
              <div className="text-base font-semibold font-[family-name:var(--font-mono)]">
                {d.getDate()}
              </div>
            </button>
          );
        })}
      </div>

      {/* Showtimes grouped by movie */}
      <div className="space-y-4">
        {Object.entries(groupedByMovie).map(([movieId, sts]) => {
          const movie = getMovieById(movieId);
          if (!movie) return null;
          return (
            <div key={movieId} className="bg-cream-light border border-warm-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-4 h-4 text-gold" />
                <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-warm-black">
                  {movie.title}
                </h3>
                <span className="font-[family-name:var(--font-khmer)] text-xs text-warm-muted">
                  {movie.titleKh}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sts.sort((a, b) => a.time.localeCompare(b.time)).map((st) => {
                  const available = st.totalSeats - st.bookedSeats.length;
                  return (
                    <div
                      key={st.id}
                      className="bg-cream border border-warm-border rounded-lg p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-[family-name:var(--font-mono)] text-sm font-semibold text-warm-black">
                          {st.time}
                        </div>
                        <div className="text-[10px] text-warm-muted">
                          {available}/{st.totalSeats} seats &bull; {formatPrice(st.price)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(st.id)}
                        className="p-1 rounded hover:bg-error/10 text-warm-muted hover:text-error transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {Object.keys(groupedByMovie).length === 0 && (
          <div className="text-center py-12 text-warm-muted text-sm">
            No showtimes for this date
          </div>
        )}
      </div>

      {/* Add form modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-[15%] max-w-md mx-auto bg-cream-light border border-warm-border rounded-2xl p-6 z-50"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-warm-black">
                  Add Showtime
                </h2>
                <button onClick={() => setShowForm(false)} className="p-1 hover:bg-cream-dark rounded-lg">
                  <X className="w-5 h-5 text-warm-muted" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-warm-muted">Movie</Label>
                  <select
                    value={form.movieId}
                    onChange={(e) => setForm({ ...form, movieId: e.target.value })}
                    className="mt-1 w-full h-9 px-3 bg-cream border border-warm-border rounded-md text-sm"
                  >
                    {movies.filter((m) => m.status === "now_showing").map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-warm-muted">Date</Label>
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="mt-1 bg-cream border-warm-border"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-warm-muted">Time</Label>
                    <Input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="mt-1 bg-cream border-warm-border font-[family-name:var(--font-mono)]"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-warm-muted">Price per seat ($)</Label>
                  <Input
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="mt-1 bg-cream border-warm-border font-[family-name:var(--font-mono)]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 border-warm-border">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAdd}
                    className="flex-1 bg-gold hover:bg-gold-light text-warm-black font-semibold"
                  >
                    Add Showtime
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
