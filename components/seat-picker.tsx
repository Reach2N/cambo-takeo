"use client";

import { motion } from "framer-motion";
import { seatLayout } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

interface SeatPickerProps {
  bookedSeats: string[];
  selectedSeats: string[];
  onSeatToggle: (seatId: string) => void;
}

export function SeatPicker({ bookedSeats, selectedSeats, onSeatToggle }: SeatPickerProps) {
  const { t } = useI18n();
  const getSeatStatus = (seatId: string) => {
    if (seatLayout.blocked.includes(seatId)) return "blocked";
    if (bookedSeats.includes(seatId)) return "taken";
    if (selectedSeats.includes(seatId)) return "selected";
    if (seatLayout.wheelchair.includes(seatId)) return "wheelchair";
    return "available";
  };

  const getSeatColor = (status: string, rowId: string) => {
    switch (status) {
      case "available":
        // Front 9 rows (A-I) -> Dark Red (outline)
        if (rowId >= "A" && rowId <= "I") {
          return "bg-background border border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white cursor-pointer";
        }
        // Next 3 rows (J-L) -> Pale Yellow (outline)
        if (rowId >= "J" && rowId <= "L") {
          return "bg-background border border-[#F0E68C] text-[#BDB76B] hover:bg-[#F0E68C] hover:text-black cursor-pointer";
        }
        // Last 2 rows (M-N) -> Blue (outline)
        if (rowId >= "M") {
          return "bg-background border border-[#0000FF] text-[#0000FF] hover:bg-[#0000FF] hover:text-white cursor-pointer";
        }
        return "bg-border hover:bg-primary/40 cursor-pointer border-border";
      case "taken":
        return "bg-muted-foreground cursor-not-allowed opacity-60";
      case "selected":
        return "bg-primary text-primary-foreground cursor-pointer shadow-md shadow-primary/30 scale-110 font-bold border-primary";
      case "blocked":
        return "invisible";
      default:
        return "bg-border";
    }
  };

  return (
    <div className="bg-foreground/5 rounded-2xl p-4 sm:p-6">
      {/* Screen */}
      <div className="mb-8">
        <div className="screen-curve w-3/4 max-w-md mx-auto" />
        <p className="text-center text-xs text-muted-foreground mt-2 font-medium tracking-widest uppercase">
          {t("seat.screen")}
        </p>
      </div>

      {/* Seat grid */}
      <div className="flex flex-col items-center gap-1.5 sm:gap-2">
        {seatLayout.rows.map((row) => (
          <div key={row.id} className="flex items-center gap-1 sm:gap-1.5">
            {/* Row label */}
            <span className="w-5 text-xs font-[family-name:var(--font-mono)] text-muted-foreground font-medium text-right">
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
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-t-md text-[8px] sm:text-[9px] font-[family-name:var(--font-mono)] border flex items-center justify-center transition-all duration-200 ${getSeatColor(status, row.id)}`}
                    title={`${seatId}${status === "taken" ? " (Taken)" : ""}`}
                  >
                    {status === "selected" && (
                      <span className="font-semibold">{i + 1}</span>
                    )}
                    {status === "taken" && (
                      <span className="text-background/50 text-[7px]">&times;</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Offset spacer (right) */}
            {row.offset && <div style={{ width: `${row.offset * 28}px` }} className="hidden sm:block" />}
            {row.offset && <div style={{ width: `${row.offset * 22}px` }} className="sm:hidden" />}

            {/* Row label (right) */}
            <span className="w-5 text-xs font-[family-name:var(--font-mono)] text-muted-foreground font-medium">
              {row.id}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 sm:gap-6 mt-6">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-t-sm bg-border border border-border" />
          <span className="text-xs text-muted-foreground">{t("seat.available")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-t-sm bg-muted-foreground opacity-60" />
          <span className="text-xs text-muted-foreground">{t("seat.taken")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-t-sm bg-primary shadow-sm" />
          <span className="text-xs text-muted-foreground">{t("seat.selected")}</span>
        </div>
      </div>
    </div>
  );
}
