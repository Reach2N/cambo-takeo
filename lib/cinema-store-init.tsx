"use client";

import { useCinemaSync } from "./cinema-store";

export function CinemaStoreInit() {
  useCinemaSync();
  return null;
}
