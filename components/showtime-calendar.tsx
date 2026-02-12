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
  pointerWithin,
  type DragStartEvent,
  type DragEndEvent,
  type DragMoveEvent,
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
const HOUR_HEIGHT = 40; // Reduced height
const PX_PER_MINUTE = HOUR_HEIGHT / 60;
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;
const TOTAL_HEIGHT = TOTAL_MINUTES * PX_PER_MINUTE;
const COL_WIDTH = 140;
const SNAP_MINUTES = 5; // 5-minute precision
const MIN_BLOCK_HEIGHT = 28;

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
  isDragActive,
  onClick,
}: {
  showtime: Showtime;
  movie: Movie;
  colorClass: string;
  topPx: number;
  heightPx: number;
  isDragActive: boolean;
  onClick?: (e: React.MouseEvent) => void;
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
    height: Math.max(heightPx, MIN_BLOCK_HEIGHT),
    zIndex: isDragging ? 50 : 10,
    opacity: isDragging ? 0.3 : 1,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    pointerEvents: isDragActive && !isDragging ? "none" : "auto",
  };

  const available = showtime.totalSeats - showtime.bookedSeats.length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border px-2 py-1 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-lg select-none overflow-hidden ${colorClass}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
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

// ── Droppable day column (single droppable per day) ──

function DayColumn({
  date,
  dayShowtimes,
  movies,
  movieIds,
  onClickEmpty,
  onShowtimeClick,
  isTodayCol,
  activeDragId,
  dropPreview,
  nowTop,
}: {
  date: string;
  dayShowtimes: Showtime[];
  movies: Movie[];
  movieIds: string[];
  onClickEmpty: (date: string, time: string) => void;
  onShowtimeClick?: (showtime: Showtime) => void;
  isTodayCol: boolean;
  activeDragId: string | null;
  dropPreview: { date: string; minutes: number } | null;
  nowTop: number;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${date}`,
    data: { date },
  });

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const minutes = START_HOUR * 60 + y / PX_PER_MINUTE;
      const snapped = roundToNearestSlot(minutes, SNAP_MINUTES);
      const clamped = Math.max(START_HOUR * 60, Math.min(snapped, (END_HOUR - 1) * 60));
      onClickEmpty(date, minutesToTimeString(clamped));
    },
    [date, onClickEmpty]
  );

  return (
    <div
      ref={setNodeRef}
      onClick={handleClick}
      className={`shrink-0 relative border-l border-border/50 cursor-pointer transition-colors ${isTodayCol ? "bg-primary/5" : ""
        } ${isOver && activeDragId ? "bg-primary/8" : ""}`}
      style={{ width: COL_WIDTH, height: TOTAL_HEIGHT }}
    >
      {/* Hour grid lines */}
      {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 right-0 border-t border-border/40"
          style={{ top: i * HOUR_HEIGHT }}
        />
      ))}
      {/* Half-hour grid lines */}
      {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
        <div
          key={`hh-${i}`}
          className="absolute left-0 right-0 border-t border-border/15 border-dashed"
          style={{ top: i * HOUR_HEIGHT + HOUR_HEIGHT / 2 }}
        />
      ))}

      {/* Showtime blocks */}
      {dayShowtimes.map((st) => {
        const movie = getStoreMovieById(movies, st.movieId);
        if (!movie) return null;
        const stMinutes = timeStringToMinutes(st.time);
        const topPx = (stMinutes - START_HOUR * 60) * PX_PER_MINUTE;
        const duration = movie.duration || 120;
        const heightPx = duration * PX_PER_MINUTE;
        return (
          <ShowtimeBlock
            key={st.id}
            showtime={st}
            movie={movie}
            colorClass={getMovieColor(st.movieId, movieIds)}
            topPx={topPx}
            heightPx={heightPx}
            isDragActive={!!activeDragId}
            onClick={() => onShowtimeClick?.(st)}
          />
        );
      })}

      {/* Drop preview indicator */}
      {dropPreview && dropPreview.date === date && (
        <div
          className="absolute left-0 right-0 z-30 pointer-events-none"
          style={{ top: (dropPreview.minutes - START_HOUR * 60) * PX_PER_MINUTE }}
        >
          <div className="h-0.5 bg-primary w-full" />
          <span className="absolute -top-3.5 left-1 text-[9px] font-mono text-primary font-bold bg-card/90 backdrop-blur-sm px-1 rounded border border-primary/30">
            {minutesToTimeString(dropPreview.minutes)}
          </span>
        </div>
      )}

      {/* Current time indicator */}
      {nowTop >= 0 && (
        <div
          className="absolute left-0 right-0 z-20 pointer-events-none"
          style={{ top: nowTop }}
        >
          <div className="h-[2px] bg-red-500/80 w-full relative">
            <div className="absolute -left-[3px] -top-[3px] w-2 h-2 rounded-full bg-red-500" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Drag overlay ──

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
  const heightPx = duration * PX_PER_MINUTE;

  return (
    <div
      className={`rounded-lg border px-2 py-1 shadow-2xl cursor-grabbing ${colorClass}`}
      style={{ width: 160, height: Math.max(heightPx, MIN_BLOCK_HEIGHT) }}
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
  onEditShowtime,
}: {
  onAddShowtime?: (date: string, time: string) => void;
  onEditShowtime?: (showtime: Showtime) => void;
}) {
  const { movies, showtimes, updateShowtime } = useCinemaStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dropPreview, setDropPreview] = useState<{ date: string; minutes: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const allDates = useMemo(() => getDatesAroundToday(7, 14), []);

  const movieIds = useMemo(
    () => [...new Set(showtimes.map((s) => s.movieId))],
    [showtimes]
  );

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

  // Hour labels for the time gutter
  const hourLabels = useMemo(() => {
    const labels: { time: string; top: number }[] = [];
    for (let h = START_HOUR; h < END_HOUR; h++) {
      labels.push({
        time: minutesToTimeString(h * 60),
        top: (h - START_HOUR) * HOUR_HEIGHT,
      });
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

  // Auto-scroll to today (horizontally) + center current time (vertically)
  useEffect(() => {
    requestAnimationFrame(() => {
      const todayStr = new Date().toISOString().split("T")[0];
      const todayIndex = allDates.indexOf(todayStr);
      if (scrollRef.current) {
        const scrollTo = todayIndex * COL_WIDTH;
        scrollRef.current.scrollLeft = scrollTo;
        if (headerScrollRef.current) {
          headerScrollRef.current.scrollLeft = scrollTo;
        }
        // Center current time vertically
        const now = new Date();
        const nowMins = now.getHours() * 60 + now.getMinutes();
        if (nowMins >= START_HOUR * 60 && nowMins <= END_HOUR * 60) {
          const nowY = (nowMins - START_HOUR * 60) * PX_PER_MINUTE;
          scrollRef.current.scrollTop = Math.max(0, nowY - scrollRef.current.clientHeight / 2);
        }
      }
    });
  }, [allDates]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      const { active, over, delta } = event;
      if (!over || !active) {
        setDropPreview(null);
        return;
      }

      const showtime = showtimes.find((s) => s.id === active.id);
      if (!showtime) {
        setDropPreview(null);
        return;
      }

      const targetDate = (over.data.current as { date: string } | undefined)?.date;
      if (!targetDate) {
        setDropPreview(null);
        return;
      }

      const originalMinutes = timeStringToMinutes(showtime.time);
      const deltaMinutes = delta.y / PX_PER_MINUTE;
      const newMinutes = roundToNearestSlot(originalMinutes + deltaMinutes, SNAP_MINUTES);
      const clampedMinutes = Math.max(
        START_HOUR * 60,
        Math.min(newMinutes, END_HOUR * 60 - SNAP_MINUTES)
      );

      setDropPreview({ date: targetDate, minutes: clampedMinutes });
    },
    [showtimes]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      setDropPreview(null);
      const { active, over, delta } = event;
      if (!over) return;

      const showtimeId = active.id as string;
      const showtime = showtimes.find((s) => s.id === showtimeId);
      if (!showtime) return;

      const targetDate = (over.data.current as { date: string } | undefined)?.date;
      if (!targetDate) return;

      const originalMinutes = timeStringToMinutes(showtime.time);
      const deltaMinutes = delta.y / PX_PER_MINUTE;
      const newMinutes = roundToNearestSlot(originalMinutes + deltaMinutes, SNAP_MINUTES);
      const clampedMinutes = Math.max(
        START_HOUR * 60,
        Math.min(newMinutes, END_HOUR * 60 - SNAP_MINUTES)
      );
      const newTime = minutesToTimeString(clampedMinutes);

      if (showtime.date !== targetDate || showtime.time !== newTime) {
        updateShowtime(showtimeId, {
          date: targetDate,
          time: newTime,
        });
      }
    },
    [showtimes, updateShowtime]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setDropPreview(null);
  }, []);

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

  // Current time indicator
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const todayStr = now.toISOString().split("T")[0];
  const nowInRange = nowMinutes >= START_HOUR * 60 && nowMinutes <= END_HOUR * 60;
  const nowTop = nowInRange ? (nowMinutes - START_HOUR * 60) * PX_PER_MINUTE : -1;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        {/* Sticky day headers */}
        <div
          ref={headerScrollRef}
          className="overflow-hidden border-b border-border"
          style={{ pointerEvents: "none" }}
        >
          <div className="flex" style={{ paddingLeft: 56 }}>
            {allDates.map((date) => {
              const d = new Date(date + "T00:00:00");
              return (
                <div
                  key={date}
                  className={`shrink-0 p-2 text-center border-l border-border/50 ${isToday(date) ? "bg-primary/10" : ""
                    }`}
                  style={{ width: COL_WIDTH }}
                >
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {formatDate(date) === "Today" ? "Today" : formatWeekday(date)}
                  </div>
                  <div
                    className={`text-sm font-semibold font-[family-name:var(--font-mono)] ${isToday(date) ? "text-primary" : "text-foreground"
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
          <div className="flex" style={{ width: 56 + allDates.length * COL_WIDTH }}>
            {/* Time labels column */}
            <div
              className="shrink-0 sticky left-0 z-20 bg-card border-r border-border/30"
              style={{ width: 56, height: TOTAL_HEIGHT }}
            >
              {hourLabels.map(({ time, top }) => (
                <div
                  key={time}
                  className="absolute right-2 text-[10px] font-mono text-muted-foreground leading-none"
                  style={{ top: top + 4 }}
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {allDates.map((date) => (
              <DayColumn
                key={date}
                date={date}
                dayShowtimes={showtimesByDate[date] || []}
                movies={movies}
                movieIds={movieIds}
                onClickEmpty={handleClickEmpty}
                onShowtimeClick={onEditShowtime}
                isTodayCol={isToday(date)}
                activeDragId={activeId}
                dropPreview={dropPreview}
                nowTop={date === todayStr ? nowTop : -1}
              />
            ))}
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
