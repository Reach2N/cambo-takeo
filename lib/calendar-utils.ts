export function timeStringToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function getSlotPosition(time: string, startHour: number): number {
  const minutes = timeStringToMinutes(time);
  return minutes - startHour * 60;
}

export function roundToNearestSlot(minutes: number, slotSize: number = 30): number {
  return Math.round(minutes / slotSize) * slotSize;
}

export function getWeekDates(baseDate: Date): string[] {
  const dates: string[] = [];
  const day = baseDate.getDay();
  // Monday = start of week (0 = Mon)
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - ((day + 6) % 7));
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

export function formatWeekday(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en", { weekday: "short" });
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en", { month: "short", day: "numeric" });
}

/**
 * Check if a showtime is still upcoming (not yet started + 30 min buffer).
 * Past dates always return false. Future dates always return true.
 */
export function isShowtimeUpcoming(date: string, time: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  if (date < today) return false;
  if (date > today) return true;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const showtimeMinutes = timeStringToMinutes(time);
  // Show if the showtime hasn't started more than 30 minutes ago
  return showtimeMinutes + 30 > nowMinutes;
}

/**
 * Get an array of date strings starting from today.
 */
export function getDatesFromToday(count: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

/**
 * Get an array of date strings around today (past + today + future).
 */
export function getDatesAroundToday(pastDays: number, futureDays: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = -pastDays; i <= futureDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}
