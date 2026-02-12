// Legend Cinema API client
// Primary source for movies with localized data (trailers, Khmer captions, etc.)

const LEGEND_API_BASE = "https://api.legend.com.kh";

export interface LegendMovie {
  id: string;
  vistaFilmId: string;
  title: string;
  rating: string;
  synopsis: string;
  genreName: string;
  trailerUrl: string;
  runTime: number;
  openingDate: string;
  bannerImageUrl: string;
  backdropImageUrl?: string;
  ageRatingImageUrl: string;
  shareUrl: string;
  ratingDescription: string;
  hasSession: boolean;
  distributor: string;
}

interface LegendListResponse {
  rows: LegendMovie[];
}

export async function getLegendMovies(): Promise<LegendMovie[]> {
  try {
    const url = `${LEGEND_API_BASE}/films?limit=100&sort=latest-released`;
    const res = await fetch(url, {
      next: { revalidate: 1800 }, // 30 minutes cache
      headers: { "Accept": "application/json" },
    });
    if (!res.ok) return [];
    const data: LegendListResponse = await res.json();
    return data.rows ?? [];
  } catch {
    return [];
  }
}

export async function getLegendComingSoonMovies(): Promise<LegendMovie[]> {
  try {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);
    const url = `${LEGEND_API_BASE}/films?limit=100&isComingSoon=true&date=${futureDate.toISOString()}&sort=early-released`;
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data: LegendListResponse = await res.json();
    return data.rows ?? [];
  } catch {
    return [];
  }
}

// Extract YouTube video ID from various URL formats
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : null;
}

// Map Legend Cinema movie to our app Movie type
export function mapLegendToMovie(legend: LegendMovie) {
  const genres = legend.genreName
    ? legend.genreName.split(";").map((g) => g.trim()).filter(Boolean)
    : [];

  const slug = legend.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const hour = Math.floor(legend.runTime / 60);
  const minute = legend.runTime % 60;

  const trailerYouTubeId = extractYouTubeId(legend.trailerUrl);

  // Determine status based on sessions
  const status = legend.hasSession ? "now_showing" : "coming_soon";

  return {
    id: legend.vistaFilmId,
    tmdbId: undefined,
    slug,
    title: legend.title,
    titleKh: "", // Legend doesn't always have Khmer titles in this field
    posterUrl: legend.bannerImageUrl,
    backdropUrl: legend.backdropImageUrl || "",
    trailerUrl: legend.trailerUrl,
    trailerKey: trailerYouTubeId ?? "",
    duration: legend.runTime,
    durationFormatted: legend.runTime > 0 ? `${hour}h ${minute}m` : "",
    genre: genres.slice(0, 3),
    rating: legend.rating,
    subtitleLang: legend.ratingDescription?.includes("China") ? "中文" : "ខ្មែរ",
    synopsis: legend.synopsis,
    synopsisKh: "",
    releaseDate: legend.openingDate,
    status: status as "now_showing" | "coming_soon",
    voteAverage: 0,
    voteCount: 0,
    source: "legend" as const,
    distributor: legend.distributor,
    hasSession: legend.hasSession,
  };
}
