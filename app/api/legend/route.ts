import { NextResponse } from "next/server";
import { getLegendMovies, mapLegendToMovie } from "@/lib/legend";

export const revalidate = 1800; // 30 min cache

export async function GET() {
  try {
    const legendMovies = await getLegendMovies();
    const mapped = legendMovies.map(mapLegendToMovie);

    // Sort by release date (earliest first)
    mapped.sort((a, b) => (a.releaseDate || "").localeCompare(b.releaseDate || ""));

    return NextResponse.json({
      source: "legend",
      movies: mapped,
      count: mapped.length,
    });
  } catch {
    return NextResponse.json({ source: "legend", movies: [], count: 0 });
  }
}
