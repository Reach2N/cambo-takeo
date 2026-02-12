"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, X, Calendar, ExternalLink, List, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  formatDate,
  formatPrice,
  type Showtime,
} from "@/lib/mock-data";
import { useCinemaStore, getStoreMovieById } from "@/lib/cinema-store";
import { MovieSelect } from "@/components/movie-select";
import { ShowtimeCalendar } from "@/components/showtime-calendar";
import { getDatesAroundToday } from "@/lib/calendar-utils";

import { useI18n } from "@/lib/i18n";

type ViewMode = "list" | "calendar";

export default function AdminShowtimesPage() {
  const { movies, showtimes: showtimeList, addShowtime, deleteShowtime } = useCinemaStore();
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [form, setForm] = useState({
    movieId: movies[0]?.id || "",
    date: new Date().toISOString().split("T")[0],
    time: "14:00",
    price: "4.00",
  });

  // Filter showtimes for selected date (show all, including past)
  const filtered = useMemo(() => {
    return showtimeList.filter((s) => s.date === selectedDate);
  }, [showtimeList, selectedDate]);

  // 7 past days + today + 14 future days
  const dates = useMemo(() => getDatesAroundToday(7, 14), []);

  // Date pills: auto-scroll to today + drag-to-scroll
  const datePillsRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  useEffect(() => {
    if (!datePillsRef.current) return;
    requestAnimationFrame(() => {
      const today = new Date().toISOString().split("T")[0];
      const todayIdx = dates.indexOf(today);
      if (todayIdx > 0 && datePillsRef.current) {
        datePillsRef.current.scrollLeft = todayIdx * 64 - 16;
      }
    });
  }, [dates]);

  const openAddForm = (date?: string, time?: string) => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    setForm({
      movieId: movies[0]?.id || "",
      date: date || now.toISOString().split("T")[0],
      time: time || currentTime,
      price: "4.00",
    });
    setShowForm(true);
  };

  const handleAdd = () => {
    const selectedDateTime = new Date(`${form.date}T${form.time}`);
    if (selectedDateTime < new Date()) {
      alert("Cannot add showtime in the past");
      return;
    }

    const newShowtime: Showtime = {
      id: String(Date.now()),
      movieId: form.movieId,
      date: form.date,
      time: form.time,
      price: parseFloat(form.price) || 4.0,
      totalSeats: 120,
      bookedSeats: [],
    };
    addShowtime(newShowtime);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteShowtime(id);
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
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          {t("admin.showtimes")}
        </h1>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-secondary/50 rounded-lg p-0.5 border border-border">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-3 h-3" />
              {t("admin.list")}
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === "calendar"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays className="w-3 h-3" />
              {t("admin.calendar")}
            </button>
          </div>

          <Button
            onClick={() => openAddForm()}
            className="bg-primary hover:bg-primary/90 text-foreground font-semibold"
          >
            <Plus className="w-3.5 h-3.5 mr-2" />
            {t("admin.addShowtime")}
          </Button>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <ShowtimeCalendar
          onAddShowtime={(date, time) => openAddForm(date, time)}
        />
      ) : (
        <>
          {/* Date pills — scrollable + drag-to-scroll */}
          <div
            ref={datePillsRef}
            className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar mb-6 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={(e) => {
              isDragging.current = true;
              dragStart.current = { x: e.pageX, scrollLeft: datePillsRef.current?.scrollLeft || 0 };
            }}
            onMouseMove={(e) => {
              if (!isDragging.current || !datePillsRef.current) return;
              datePillsRef.current.scrollLeft = dragStart.current.scrollLeft - (e.pageX - dragStart.current.x);
            }}
            onMouseUp={() => { isDragging.current = false; }}
            onMouseLeave={() => { isDragging.current = false; }}
          >
            {dates.map((date) => {
              const d = new Date(date + "T00:00:00");
              const isSelected = date === selectedDate;
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`shrink-0 w-14 h-16 rounded-xl flex flex-col items-center justify-center transition-all border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary font-semibold shadow-md"
                      : "bg-card border-border text-muted-foreground hover:border-primary/60"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wide">
                    {formatDate(date) === "Today" ? t("common.today") : d.toLocaleDateString("en", { weekday: "short" })}
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
              const movie = getStoreMovieById(movies, movieId);
              if (!movie) return null;
              return (
                <div key={movieId} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
                      {movie.title}
                    </h3>
                    <span className="font-[family-name:var(--font-khmer)] text-xs text-muted-foreground">
                      {movie.titleKh}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {sts.sort((a, b) => a.time.localeCompare(b.time)).map((st) => {
                      const available = st.totalSeats - st.bookedSeats.length;
                      return (
                        <div
                          key={st.id}
                          className="bg-background border border-border rounded-xl flex flex-col items-center justify-center relative group hover:border-primary/60 transition-all py-3"
                        >
                          <Link href={`/book/${st.id}`} className="flex flex-col items-center justify-center hover:opacity-80 transition-opacity">
                            <div className="font-[family-name:var(--font-mono)] text-lg font-semibold text-foreground">
                              {st.time}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {available}/{st.totalSeats}
                            </div>
                            <div className="text-[10px] text-primary font-medium font-[family-name:var(--font-mono)]">
                              {formatPrice(st.price)}
                            </div>
                          </Link>
                          <button
                            onClick={() => handleDelete(st.id)}
                            className="absolute top-1 right-1 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {Object.keys(groupedByMovie).length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                {t("admin.noShowtimes")}
              </div>
            )}
          </div>
        </>
      )}

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
              className="fixed inset-x-4 top-[15%] max-w-md mx-auto bg-card border border-border rounded-2xl p-6 z-50"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
                  {t("admin.addShowtime")}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-1 hover:bg-secondary rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <MovieSelect
                    movies={movies}
                    value={form.movieId}
                    onChange={(id) => setForm({ ...form, movieId: id })}
                    label={t("admin.movie")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("common.date")}</Label>
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="mt-1 bg-background border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("common.time")}</Label>
                    <Input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="mt-1 bg-background border-border font-[family-name:var(--font-mono)]"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t("admin.pricePerSeat")}</Label>
                  <Input
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="mt-1 bg-background border-border font-[family-name:var(--font-mono)]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 border-border">
                    {t("common.cancel")}
                  </Button>
                  <Button
                    onClick={handleAdd}
                    className="flex-1 bg-primary hover:bg-primary/90 text-foreground font-semibold"
                  >
                    {t("admin.addShowtime")}
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
