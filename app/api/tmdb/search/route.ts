import { NextResponse } from "next/server";
import { searchMovies, posterUrl, backdropUrl, GENRE_MAP } from "@/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchMovies(query);
    const mapped = results.slice(0, 15).map((m) => ({
      tmdbId: m.id,
      title: m.title,
      originalTitle: m.original_title,
      overview: m.overview,
      posterUrl: posterUrl(m.poster_path),
      backdropUrl: backdropUrl(m.backdrop_path),
      releaseDate: m.release_date,
      voteAverage: m.vote_average,
      voteCount: m.vote_count,
      genres: m.genre_ids.map((id) => GENRE_MAP[id] || "Other"),
      popularity: m.popularity,
    }));

    return NextResponse.json({ results: mapped }, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch {
    return NextResponse.json({ results: [] }, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  }
}
