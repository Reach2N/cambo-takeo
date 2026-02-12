"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { GripVertical } from "lucide-react";
import {
  type Movie,
  type Showtime,
  formatDate,
} from "@/lib/mock-data";
import { getStoreMovieById, useCinemaStore } from "@/lib/cinema-store";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  getDatesAroundToday,
  formatWeekday,
  timeStringToMinutes,
  minutesToTimeString,
  roundToNearestSlot,
} from "@/lib/calendar-utils";

// ── Constants ──

const START_HOUR = 10;
const END_HOUR = 24;
const SLOT_SIZE = 30; // minutes
const SLOT_HEIGHT = 40; // px per 30-min slot
const TOTAL_SLOTS = ((END_HOUR - START_HOUR) * 60) / SLOT_SIZE;
const VISIBLE_DAYS = 14;

// ── Movie color palette ──

const MOVIE_COLORS = [
  "bg-blue-500/20 border-blue-500/40 text-blue-400 dark:text-blue-300",
  "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 dark:text-emerald-300",
  "bg-purple-500/20 border-purple-500/40 text-purple-400 dark:text-purple-300",
  "bg-amber-500/20 border-amber-500/40 text-amber-400 dark:text-amber-300",
  "bg-rose-500/20 border-rose-500/40 text-rose-400 dark:text-rose-300",
  "bg-cyan-500/20 border-cyan-500/40 text-cyan-400 dark:text-cyan-300",
  "bg-indigo-500/20 border-indigo-500/40 text-indigo-400 dark:text-indigo-300",
  "bg-orange-500/20 border-orange-500/40 text-orange-400 dark:text-orange-300",
];

function getMovieColor(movieId: string, movieIds: string[]): string {
  const idx = movieIds.indexOf(movieId);
  return MOVIE_COLORS[idx % MOVIE_COLORS.length];
}

// ── Draggable showtime block ──

function ShowtimeBlock({
  showtime,
  movie,
  colorClass,
  topPx,
  heightPx,
}: {
  showtime: Showtime;
  movie: Movie;
  colorClass: string;
  topPx: number;
  heightPx: number;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: showtime.id,
    data: { showtime },
  });

  const style: React.CSSProperties = {
    position: "absolute",
    top: topPx,
    left: 4,
    right: 4,
    height: Math.max(heightPx, SLOT_HEIGHT),
    zIndex: isDragging ? 50 : 10,
    opacity: isDragging ? 0.5 : 1,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  const available = showtime.totalSeats - showtime.bookedSeats.length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border px-2 py-1 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-lg select-none ${colorClass}`}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-center gap-1 min-w-0">
        <GripVertical className="w-3 h-3 opacity-50 shrink-0" />
        <span className="text-[10px] font-semibold truncate">{movie.title}</span>
      </div>
      <div className="text-[9px] opacity-70 font-mono">
        {showtime.time} · {available}/{showtime.totalSeats}
      </div>
    </div>
  );
}

// ── Droppable time cell ──

function TimeSlotCell({
  date,
  slotIndex,
  onClickEmpty,
}: {
  date: string;
  slotIndex: number;
  onClickEmpty: (date: string, time: string) => void;
}) {
  const minutes = START_HOUR * 60 + slotIndex * SLOT_SIZE;
  const time = minutesToTimeString(minutes);
  const droppableId = `${date}-${time}`;

  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: { date, time, minutes },
  });

  return (
    <div
      ref={setNodeRef}
      onClick={() => onClickEmpty(date, time)}
      className={`border-b border-border/30 transition-colors cursor-pointer hover:bg-primary/5 ${
        isOver ? "bg-primary/15" : ""
      } ${slotIndex % 2 === 0 ? "border-b-border/50" : ""}`}
      style={{ height: SLOT_HEIGHT }}
    />
  );
}

// ── Drag overlay for smooth rendering ──

function DragOverlayBlock({
  showtime,
  movie,
  colorClass,
}: {
  showtime: Showtime;
  movie: Movie;
  colorClass: string;
}) {
  const available = showtime.totalSeats - showtime.bookedSeats.length;
  const duration = movie.duration || 120;
  const heightPx = (duration / SLOT_SIZE) * SLOT_HEIGHT;

  return (
    <div
      className={`rounded-lg border px-2 py-1 shadow-2xl cursor-grabbing ${colorClass}`}
      style={{ width: 160, height: Math.max(heightPx, SLOT_HEIGHT) }}
    >
      <div className="flex items-center gap-1 min-w-0">
        <GripVertical className="w-3 h-3 opacity-50 shrink-0" />
        <span className="text-[10px] font-semibold truncate">{movie.title}</span>
      </div>
      <div className="text-[9px] opacity-70 font-mono">
        {showtime.time} · {available}/{showtime.totalSeats}
      </div>
    </div>
  );
}

// ── Main Calendar ──

export function ShowtimeCalendar({
  onAddShowtime,
}: {
  onAddShowtime?: (date: string, time: string) => void;
}) {
  const { movies, showtimes, updateShowtime } = useCinemaStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  // Show 7 past days + today + 14 future days
  const allDates = useMemo(() => getDatesAroundToday(7, 14), []);

  // Unique movie IDs for color assignment
  const movieIds = useMemo(
    () => [...new Set(showtimes.map((s) => s.movieId))],
    [showtimes]
  );

  // Group showtimes by date
  const showtimesByDate = useMemo(() => {
    const map: Record<string, Showtime[]> = {};
    for (const date of allDates) {
      map[date] = showtimes.filter((s) => s.date === date);
    }
    return map;
  }, [showtimes, allDates]);

  const activeShowtime = activeId
    ? showtimes.find((s) => s.id === activeId)
    : null;
  const activeMovie = activeShowtime
    ? getStoreMovieById(movies, activeShowtime.movieId)
    : null;

  // Time labels
  const timeLabels = useMemo(() => {
    const labels: string[] = [];
    for (let i = 0; i < TOTAL_SLOTS; i++) {
      const minutes = START_HOUR * 60 + i * SLOT_SIZE;
      if (i % 2 === 0) {
        labels.push(minutesToTimeString(minutes));
      } else {
        labels.push("");
      }
    }
    return labels;
  }, []);

  // Sync horizontal scroll between header and body
  useEffect(() => {
    const body = scrollRef.current;
    const header = headerScrollRef.current;
    if (!body || !header) return;

    const onBodyScroll = () => {
      header.scrollLeft = body.scrollLeft;
    };
    body.addEventListener("scroll", onBodyScroll);
    return () => body.removeEventListener("scroll", onBodyScroll);
  }, []);

  // Auto-scroll calendar to today's column on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      const todayStr = new Date().toISOString().split("T")[0];
      const todayIndex = allDates.indexOf(todayStr);
      if (todayIndex > 0 && scrollRef.current) {
        const scrollTo = todayIndex * COL_WIDTH;
        scrollRef.current.scrollLeft = scrollTo;
        if (headerScrollRef.current) {
          headerScrollRef.current.scrollLeft = scrollTo;
        }
      }
    });
  }, [allDates]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over) return;

      const showtimeId = active.id as string;
      const dropData = over.data.current as { date: string; time: string; minutes: number } | undefined;
      if (!dropData) return;

      const showtime = showtimes.find((s) => s.id === showtimeId);
      if (!showtime) return;

      const snappedMinutes = roundToNearestSlot(dropData.minutes, SLOT_SIZE);
      const clampedMinutes = Math.max(
        START_HOUR * 60,
        Math.min(snappedMinutes, (END_HOUR - 1) * 60)
      );
      const newTime = minutesToTimeString(clampedMinutes);

      if (showtime.date !== dropData.date || showtime.time !== newTime) {
        updateShowtime(showtimeId, {
          date: dropData.date,
          time: newTime,
        });
      }
    },
    [showtimes, updateShowtime]
  );

  const handleClickEmpty = useCallback(
    (date: string, time: string) => {
      onAddShowtime?.(date, time);
    },
    [onAddShowtime]
  );

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    return dateStr === today;
  };

  const COL_WIDTH = 140; // px per day column

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Calendar grid */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        {/* Sticky day headers — synced scroll */}
        <div
          ref={headerScrollRef}
          className="overflow-hidden border-b border-border"
          style={{ pointerEvents: "none" }}
        >
          <div className="flex" style={{ paddingLeft: 60 }}>
            {allDates.map((date) => {
              const d = new Date(date + "T00:00:00");
              return (
                <div
                  key={date}
                  className={`shrink-0 p-2 text-center border-l border-border/50 ${
                    isToday(date) ? "bg-primary/10" : ""
                  }`}
                  style={{ width: COL_WIDTH }}
                >
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {formatDate(date) === "Today" ? "Today" : formatWeekday(date)}
                  </div>
                  <div
                    className={`text-sm font-semibold font-[family-name:var(--font-mono)] ${
                      isToday(date) ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable time grid */}
        <div
          ref={scrollRef}
          className="overflow-auto"
          style={{ maxHeight: "calc(100vh - 220px)" }}
        >
          <div className="flex" style={{ width: 60 + allDates.length * COL_WIDTH }}>
            {/* Time labels column */}
            <div className="shrink-0 sticky left-0 z-10 bg-card" style={{ width: 60 }}>
              {timeLabels.map((label, i) => (
                <div
                  key={i}
                  className={`flex items-start justify-end pr-2 text-[10px] font-mono text-muted-foreground ${
                    label ? "" : "opacity-0"
                  }`}
                  style={{ height: SLOT_HEIGHT }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {allDates.map((date) => {
              const dayShowtimes = showtimesByDate[date] || [];

              return (
                <div
                  key={date}
                  className={`shrink-0 relative border-l border-border/50 ${
                    isToday(date) ? "bg-primary/5" : ""
                  }`}
                  style={{ width: COL_WIDTH }}
                >
                  {/* Drop zones */}
                  {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
                    <TimeSlotCell
                      key={i}
                      date={date}
                      slotIndex={i}
                      onClickEmpty={handleClickEmpty}
                    />
                  ))}

                  {/* Showtime blocks */}
                  {dayShowtimes.map((st) => {
                    const movie = getStoreMovieById(movies, st.movieId);
                    if (!movie) return null;

                    const stMinutes = timeStringToMinutes(st.time);
                    const topPx =
                      ((stMinutes - START_HOUR * 60) / SLOT_SIZE) * SLOT_HEIGHT;
                    const duration = movie.duration || 120;
                    const heightPx = (duration / SLOT_SIZE) * SLOT_HEIGHT;

                    return (
                      <ShowtimeBlock
                        key={st.id}
                        showtime={st}
                        movie={movie}
                        colorClass={getMovieColor(st.movieId, movieIds)}
                        topPx={topPx}
                        heightPx={heightPx}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeShowtime && activeMovie ? (
          <DragOverlayBlock
            showtime={activeShowtime}
            movie={activeMovie}
            colorClass={getMovieColor(activeShowtime.movieId, movieIds)}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
