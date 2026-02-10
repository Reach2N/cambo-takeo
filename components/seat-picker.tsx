"use client";

import { motion } from "framer-motion";
import { seatLayout } from "@/lib/mock-data";

interface SeatPickerProps {
  bookedSeats: string[];
  selectedSeats: string[];
  onSeatToggle: (seatId: string) => void;
}

export function SeatPicker({ bookedSeats, selectedSeats, onSeatToggle }: SeatPickerProps) {
  const getSeatStatus = (seatId: string) => {
    if (seatLayout.blocked.includes(seatId)) return "blocked";
    if (bookedSeats.includes(seatId)) return "taken";
    if (selectedSeats.includes(seatId)) return "selected";
    if (seatLayout.wheelchair.includes(seatId)) return "wheelchair";
    return "available";
  };

  const getSeatColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-seat-available hover:bg-gold-light cursor-pointer border-warm-border";
      case "taken":
        return "bg-seat-taken cursor-not-allowed opacity-60";
      case "selected":
        return "bg-seat-selected text-warm-black cursor-pointer shadow-md shadow-gold/30";
      case "blocked":
        return "invisible";
      case "wheelchair":
        return "bg-seat-available hover:bg-gold-light cursor-pointer border-warm-border ring-1 ring-gold/50";
      default:
        return "bg-seat-available";
    }
  };

  return (
    <div className="bg-warm-dark/5 rounded-2xl p-4 sm:p-6">
      {/* Screen */}
      <div className="mb-8">
        <div className="screen-curve w-3/4 max-w-md mx-auto" />
        <p className="text-center text-xs text-warm-muted mt-2 font-medium tracking-widest uppercase">
          Screen
        </p>
      </div>

      {/* Seat grid */}
      <div className="flex flex-col items-center gap-1.5 sm:gap-2">
        {seatLayout.rows.map((row) => (
          <div key={row.id} className="flex items-center gap-1 sm:gap-1.5">
            {/* Row label */}
            <span className="w-5 text-xs font-[family-name:var(--font-mono)] text-warm-muted font-medium text-right">
              {row.id}
            </span>

            {/* Offset spacer */}
            {row.offset && <div style={{ width: `${row.offset * 28}px` }} className="hidden sm:block" />}
            {row.offset && <div style={{ width: `${row.offset * 22}px` }} className="sm:hidden" />}

            {/* Seats */}
            <div className="flex gap-0.5 sm:gap-1">
              {Array.from({ length: row.seats }, (_, i) => {
                const seatId = `${row.id}${i + 1}`;
                const status = getSeatStatus(seatId);

                return (
                  <motion.button
                    key={seatId}
                    whileTap={status === "available" || status === "selected" || status === "wheelchair" ? { scale: 0.9 } : {}}
                    onClick={() => {
                      if (status === "available" || status === "selected" || status === "wheelchair") {
                        onSeatToggle(seatId);
                      }
                    }}
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-t-md text-[8px] sm:text-[9px] font-[family-name:var(--font-mono)] border flex items-center justify-center transition-all duration-200 ${getSeatColor(status)}`}
                    title={`${seatId}${status === "taken" ? " (Taken)" : ""}`}
                  >
                    {status === "selected" && (
                      <span className="font-semibold">{i + 1}</span>
                    )}
                    {status === "taken" && (
                      <span className="text-cream/50 text-[7px]">&times;</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Offset spacer (right) */}
            {row.offset && <div style={{ width: `${row.offset * 28}px` }} className="hidden sm:block" />}
            {row.offset && <div style={{ width: `${row.offset * 22}px` }} className="sm:hidden" />}

            {/* Row label (right) */}
            <span className="w-5 text-xs font-[family-name:var(--font-mono)] text-warm-muted font-medium">
              {row.id}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 sm:gap-6 mt-6">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-t-sm bg-seat-available border border-warm-border" />
          <span className="text-xs text-warm-muted">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-t-sm bg-seat-taken opacity-60" />
          <span className="text-xs text-warm-muted">Taken</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-t-sm bg-seat-selected shadow-sm" />
          <span className="text-xs text-warm-muted">Selected</span>
        </div>
      </div>
    </div>
  );
}
