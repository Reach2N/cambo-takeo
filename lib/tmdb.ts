const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p";

function getApiKey(): string | null {
  return process.env.TMDB_API_KEY && process.env.TMDB_API_KEY !== "your_tmdb_api_key_here"
    ? process.env.TMDB_API_KEY
    : null;
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
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

export interface TMDBMovieDetail extends TMDBMovie {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
      official: boolean;
    }[];
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

export function posterUrl(path: string | null, size: "w342" | "w500" | "w780" = "w500"): string {
  if (!path) return "/placeholder-poster.jpg";
  return `${TMDB_IMG}/${size}${path}`;
}

export function backdropUrl(path: string | null, size: "w780" | "w1280" | "original" = "w1280"): string {
  if (!path) return "/placeholder-backdrop.jpg";
  return `${TMDB_IMG}/${size}${path}`;
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
  const data = await tmdbFetch<TMDBListResponse>("/search/movie", { query });
  return data?.results ?? [];
}

// ── Mapper: TMDB → our app Movie type ──

export function mapTMDBToMovie(
  tmdb: TMDBMovie,
  status: "now_showing" | "coming_soon" = "now_showing"
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
    trailerUrl: "",
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

export function hasTMDBKey(): boolean {
  return getApiKey() !== null;
}

export { GENRE_MAP };
