const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p";

// Use Bearer token for TMDB API v4 authentication
const TMDB_READ_ACCESS_TOKEN =
  process.env.TMDB_READ_ACCESS_TOKEN ||
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzU0NTJmMmI2ZDRjNDM2MmFhMDAxMjYxMDc0NWNmYSIsIm5iZiI6MTc3MDcwMTIxNi4wMzksInN1YiI6IjY5OGFjMWEwY2ZhNWUyZjFiOWQ3ZjI0OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HIBeVcV4KA1b06oRZIM9w6a3jzJ4JFAB_wWjlWPyDjw";

const TMDB_API_KEY = process.env.TMDB_API_KEY || "375452f2b6d4c4362aa0012610745cfa";

function getApiKey(): string {
  return TMDB_API_KEY;
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", getApiKey());
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── TMDB response types ──

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
}

export interface TMDBVideo {
  key: string;
  site: string;
  type: string;
  official: boolean;
  name: string;
  published_at: string;
}

export interface TMDBMovieDetail extends TMDBMovie {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  videos?: {
    results: TMDBVideo[];
  };
}

interface TMDBListResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

// ── Genre map ──

const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

// ── Image URL helpers ──

export function posterUrl(path: string | null, size: "w342" | "w500" | "w780" = "w780"): string {
  if (!path) return "";
  return `${TMDB_IMG}/${size}${path}`;
}

export function backdropUrl(path: string | null, size: "w780" | "w1280" | "original" = "original"): string {
  if (!path) return "";
  return `${TMDB_IMG}/${size}${path}`;
}

// ── YouTube helpers ──

export function getYouTubeThumbnail(videoKey: string): string {
  return `https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`;
}

export function getYouTubeThumbnailHQ(
  videoKey: string,
  quality: "maxresdefault" | "sddefault" | "hqdefault" = "maxresdefault"
): string {
  return `https://img.youtube.com/vi/${videoKey}/${quality}.jpg`;
}

export function getYouTubeEmbedUrl(videoKey: string): string {
  return `https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`;
}

export function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

// ── Public API functions ──

export async function getNowPlaying(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBListResponse>("/movie/now_playing", {
    region: "KH",
    page: "1",
  });
  // fallback to US if KH returns nothing
  if (!data || data.results.length === 0) {
    const fallback = await tmdbFetch<TMDBListResponse>("/movie/now_playing", { page: "1" });
    return fallback?.results ?? [];
  }
  return data.results;
}

export async function getUpcoming(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBListResponse>("/movie/upcoming", {
    region: "KH",
    page: "1",
  });
  if (!data || data.results.length === 0) {
    const fallback = await tmdbFetch<TMDBListResponse>("/movie/upcoming", { page: "1" });
    return fallback?.results ?? [];
  }
  return data.results;
}

export async function getPopular(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch<TMDBListResponse>("/movie/popular", { page: "1" });
  return data?.results ?? [];
}

export async function getMovieDetail(id: number): Promise<TMDBMovieDetail | null> {
  return tmdbFetch<TMDBMovieDetail>(`/movie/${id}`, {
    append_to_response: "videos",
  });
}

export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  if (!query.trim()) return [];
  const data = await tmdbFetch<TMDBListResponse>("/search/movie", { query });
  return data?.results ?? [];
}

export async function getMovieVideos(id: number): Promise<TMDBVideo[]> {
  const data = await tmdbFetch<{ results: TMDBVideo[] }>(`/movie/${id}/videos`);
  return data?.results ?? [];
}

// Find the best trailer for a movie
export function findTrailer(videos: TMDBVideo[]): TMDBVideo | null {
  // Prefer official YouTube trailers
  const officialTrailer = videos.find(
    (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
  );
  if (officialTrailer) return officialTrailer;

  // Any YouTube trailer
  const anyTrailer = videos.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );
  if (anyTrailer) return anyTrailer;

  // Any YouTube teaser
  const teaser = videos.find(
    (v) => v.site === "YouTube" && v.type === "Teaser"
  );
  if (teaser) return teaser;

  // Any YouTube video
  return videos.find((v) => v.site === "YouTube") ?? null;
}

// ── Mapper: TMDB → our app Movie type ──

export function mapTMDBToMovie(
  tmdb: TMDBMovie,
  status: "now_showing" | "coming_soon" = "now_showing",
  trailerKey?: string
) {
  const genres = tmdb.genre_ids.map((id) => GENRE_MAP[id] || "Other").slice(0, 3);
  const slug = tmdb.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const rating = tmdb.adult
    ? "18+"
    : tmdb.vote_average >= 7
      ? "PG"
      : "15";

  return {
    id: String(tmdb.id),
    tmdbId: tmdb.id,
    slug,
    title: tmdb.title,
    titleKh: "", // no Khmer title from TMDB
    posterUrl: posterUrl(tmdb.poster_path),
    backdropUrl: backdropUrl(tmdb.backdrop_path),
    trailerUrl: trailerKey ? `https://www.youtube.com/embed/${trailerKey}` : "",
    duration: 0,
    genre: genres,
    rating,
    subtitleLang: "ខ្មែរ" as string,
    synopsis: tmdb.overview,
    synopsisKh: "",
    releaseDate: tmdb.release_date,
    status,
    voteAverage: tmdb.vote_average,
    voteCount: tmdb.vote_count,
  };
}

// Map detailed TMDB movie (with runtime and genres)
export function mapTMDBDetailToMovie(
  tmdb: TMDBMovieDetail,
  status: "now_showing" | "coming_soon" = "now_showing"
) {
  const genres = tmdb.genres?.map((g) => g.name).slice(0, 3) ??
    tmdb.genre_ids?.map((id) => GENRE_MAP[id] || "Other").slice(0, 3) ?? [];

  const slug = tmdb.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const rating = tmdb.adult
    ? "18+"
    : tmdb.vote_average >= 7
      ? "PG"
      : "15";

  const trailer = tmdb.videos ? findTrailer(tmdb.videos.results) : null;

  return {
    id: String(tmdb.id),
    tmdbId: tmdb.id,
    slug,
    title: tmdb.title,
    titleKh: "",
    posterUrl: posterUrl(tmdb.poster_path),
    backdropUrl: backdropUrl(tmdb.backdrop_path),
    trailerUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}` : "",
    trailerKey: trailer?.key ?? "",
    duration: tmdb.runtime ?? 0,
    genre: genres,
    rating,
    subtitleLang: "ខ្មែរ" as string,
    synopsis: tmdb.overview,
    synopsisKh: "",
    releaseDate: tmdb.release_date,
    status,
    voteAverage: tmdb.vote_average,
    voteCount: tmdb.vote_count,
  };
}

export function hasTMDBKey(): boolean {
  return true; // We have the key hardcoded
}

export { GENRE_MAP };
