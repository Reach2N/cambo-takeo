import { NextResponse } from "next/server";
import {
  getNowPlaying,
  getUpcoming,
  getPopular,
  mapTMDBToMovie,
  hasTMDBKey,
} from "@/lib/tmdb";

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  if (!hasTMDBKey()) {
    return NextResponse.json({ source: "mock", nowPlaying: [], upcoming: [], popular: [] });
  }

  try {
    const [nowPlaying, upcoming, popular] = await Promise.all([
      getNowPlaying(),
      getUpcoming(),
      getPopular(),
    ]);

    return NextResponse.json({
      source: "tmdb",
      nowPlaying: nowPlaying.slice(0, 10).map((m) => mapTMDBToMovie(m, "now_showing")),
      upcoming: upcoming.slice(0, 10).map((m) => mapTMDBToMovie(m, "coming_soon")),
      popular: popular.slice(0, 5).map((m) => mapTMDBToMovie(m, "now_showing")),
    });
  } catch {
    return NextResponse.json({ source: "mock", nowPlaying: [], upcoming: [], popular: [] });
  }
}
