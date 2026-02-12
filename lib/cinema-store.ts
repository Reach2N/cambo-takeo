"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Movie,
  type Showtime,
} from "./mock-data";
import { useEffect, useRef } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ── Supabase row mappers ──

function movieToRow(m: Movie): Record<string, unknown> {
  return {
    id: m.id,
    tmdb_id: m.tmdbId ?? null,
    slug: m.slug,
    title: m.title,
    title_kh: m.titleKh,
    poster_url: m.posterUrl,
    backdrop_url: m.backdropUrl,
    trailer_url: m.trailerUrl,
    duration: m.duration,
    genre: m.genre,
    rating: m.rating,
    subtitle_lang: m.subtitleLang,
    synopsis: m.synopsis,
    synopsis_kh: m.synopsisKh,
    release_date: m.releaseDate,
    status: m.status,
    vote_average: m.voteAverage ?? 0,
    vote_count: m.voteCount ?? 0,
    source: m.source ?? "manual",
  };
}

function rowToMovie(row: Record<string, unknown>): Movie {
  return {
    id: row.id as string,
    tmdbId: row.tmdb_id as number | undefined,
    slug: row.slug as string,
    title: row.title as string,
    titleKh: (row.title_kh as string) || "",
    posterUrl: (row.poster_url as string) || "",
    backdropUrl: (row.backdrop_url as string) || "",
    trailerUrl: (row.trailer_url as string) || "",
    duration: (row.duration as number) || 0,
    genre: (row.genre as string[]) || [],
    rating: (row.rating as string) || "PG",
    subtitleLang: (row.subtitle_lang as string) || "ខ្មែរ",
    synopsis: (row.synopsis as string) || "",
    synopsisKh: (row.synopsis_kh as string) || "",
    releaseDate: (row.release_date as string) || "",
    status: (row.status as Movie["status"]) || "now_showing",
    voteAverage: (row.vote_average as number) || 0,
    voteCount: (row.vote_count as number) || 0,
    source: (row.source as Movie["source"]) || "manual",
  };
}

function showtimeToRow(s: Showtime): Record<string, unknown> {
  return {
    id: s.id,
    movie_id: s.movieId,
    date: s.date,
    time: s.time,
    price: s.price,
    total_seats: s.totalSeats,
    booked_seats: s.bookedSeats,
  };
}

function rowToShowtime(row: Record<string, unknown>): Showtime {
  return {
    id: row.id as string,
    movieId: row.movie_id as string,
    date: row.date as string,
    time: row.time as string,
    price: (row.price as number) || 4.0,
    totalSeats: (row.total_seats as number) || 120,
    bookedSeats: (row.booked_seats as string[]) || [],
  };
}

// ── Store ──

interface CinemaState {
  movies: Movie[];
  showtimes: Showtime[];
  votes: Record<string, number>;
  userVotes: string[];
  purchasedTickets: {
    id: string;
    showtimeId: string;
    movieId: string;
    seats: string[];
    total: number;
    invoiceNumber: string;
    purchaseDate: string;
  }[];
  lastLegendSync: number | null;
  isSyncing: boolean;
  _hasHydrated: boolean;
  _supabaseReady: boolean;

  // Internal
  _setHydrated: (v: boolean) => void;

  // Movie actions
  addMovie: (movie: Movie) => void;
  addMovies: (movies: Movie[]) => void;
  updateMovie: (id: string, partial: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  setMovies: (movies: Movie[]) => void;

  // Showtime actions
  addShowtime: (showtime: Showtime) => void;
  updateShowtime: (id: string, partial: Partial<Showtime>) => void;
  deleteShowtime: (id: string) => void;

  // Tickets
  addPurchasedTicket: (ticket: CinemaState["purchasedTickets"][number]) => void;

  // Voting
  toggleVote: (movieId: string) => void;

  // Sync
  syncFromLegend: () => Promise<void>;

  // Supabase
  initializeFromSupabase: () => Promise<void>;
  subscribeToRealtime: () => () => void;
}

export const useCinemaStore = create<CinemaState>()(
  persist(
    (set, get) => ({
      movies: [],
      showtimes: [],
      votes: {},
      userVotes: [],
      purchasedTickets: [],
      lastLegendSync: null,
      isSyncing: false,
      _hasHydrated: false,
      _supabaseReady: false,

      _setHydrated: (v) => set({ _hasHydrated: v }),

      addMovie: (movie) => {
        set((state) => ({ movies: [movie, ...state.movies] }));
        // Write to Supabase
        if (isSupabaseConfigured() && supabase) {
          supabase.from("movies").upsert(movieToRow(movie)).then();
        }
      },

      addMovies: (movies) => {
        set((state) => ({ movies: [...movies, ...state.movies] }));
        if (isSupabaseConfigured() && supabase) {
          supabase.from("movies").upsert(movies.map(movieToRow)).then();
        }
      },

      updateMovie: (id, partial) => {
        set((state) => ({
          movies: state.movies.map((m) =>
            m.id === id ? { ...m, ...partial } : m
          ),
        }));
        if (isSupabaseConfigured() && supabase) {
          const updated = get().movies.find((m) => m.id === id);
          if (updated) {
            supabase.from("movies").upsert(movieToRow(updated)).then();
          }
        }
      },

      deleteMovie: (id) => {
        set((state) => ({
          movies: state.movies.filter((m) => m.id !== id),
        }));
        if (isSupabaseConfigured() && supabase) {
          supabase.from("movies").delete().eq("id", id).then();
        }
      },

      setMovies: (movies) => set({ movies }),

      addShowtime: (showtime) => {
        set((state) => ({ showtimes: [...state.showtimes, showtime] }));
        if (isSupabaseConfigured() && supabase) {
          supabase.from("showtimes").upsert(showtimeToRow(showtime)).then();
        }
      },

      updateShowtime: (id, partial) => {
        set((state) => ({
          showtimes: state.showtimes.map((s) =>
            s.id === id ? { ...s, ...partial } : s
          ),
        }));
        if (isSupabaseConfigured() && supabase) {
          const updated = get().showtimes.find((s) => s.id === id);
          if (updated) {
            supabase.from("showtimes").upsert(showtimeToRow(updated)).then();
          }
        }
      },

      deleteShowtime: (id) => {
        set((state) => ({
          showtimes: state.showtimes.filter((s) => s.id !== id),
        }));
        if (isSupabaseConfigured() && supabase) {
          supabase.from("showtimes").delete().eq("id", id).then();
        }
      },

      addPurchasedTicket: (ticket) => {
        set((state) => ({
          purchasedTickets: [ticket, ...state.purchasedTickets],
        }));
      },

      toggleVote: (movieId) => {
        set((state) => {
          const hasVoted = state.userVotes.includes(movieId);
          const newCount = (state.votes[movieId] || 0) + (hasVoted ? -1 : 1);
          // Write to Supabase
          if (isSupabaseConfigured() && supabase) {
            supabase
              .from("votes")
              .upsert({ movie_id: movieId, count: Math.max(0, newCount) })
              .then();
          }
          return {
            votes: {
              ...state.votes,
              [movieId]: newCount,
            },
            userVotes: hasVoted
              ? state.userVotes.filter((id) => id !== movieId)
              : [...state.userVotes, movieId],
          };
        });
      },

      syncFromLegend: async () => {
        set({ isSyncing: true });
        try {
          const res = await fetch("/api/legend");
          const data = await res.json();
          if (data.movies && data.movies.length > 0) {
            const legendMovies: Movie[] = data.movies.map(
              (m: Record<string, unknown>) => ({
                id: m.id as string,
                slug: m.slug as string,
                title: m.title as string,
                titleKh: (m.titleKh as string) || "",
                posterUrl: m.posterUrl as string,
                backdropUrl: m.backdropUrl as string,
                trailerUrl: m.trailerUrl as string,
                duration: m.duration as number,
                genre: m.genre as string[],
                rating: m.rating as string,
                subtitleLang: (m.subtitleLang as string) || "ខ្មែរ",
                synopsis: m.synopsis as string,
                synopsisKh: (m.synopsisKh as string) || "",
                releaseDate: m.releaseDate as string,
                status: m.status as Movie["status"],
                voteAverage: (m.voteAverage as number) || 0,
                voteCount: (m.voteCount as number) || 0,
                source: "legend" as const,
              })
            );

            set((state) => {
              const existingTitles = new Set(
                state.movies.map((m) => m.title.toLowerCase())
              );
              const newLegend = legendMovies.filter(
                (lm) => !existingTitles.has(lm.title.toLowerCase())
              );

              // Also push new legend movies to Supabase
              if (isSupabaseConfigured() && supabase && newLegend.length > 0) {
                supabase.from("movies").upsert(newLegend.map(movieToRow)).then();
              }

              return {
                movies: [...state.movies, ...newLegend],
                lastLegendSync: Date.now(),
              };
            });
          }
        } catch {
          // silent fail
        }
        set({ isSyncing: false });
      },

      // ── Supabase init ──

      initializeFromSupabase: async () => {
        if (!isSupabaseConfigured() || !supabase) return;

        try {
          // Load movies
          const { data: movieRows } = await supabase
            .from("movies")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100);

          // Load showtimes
          const { data: showtimeRows } = await supabase
            .from("showtimes")
            .select("*")
            .order("date", { ascending: true })
            .limit(100);

          // Load votes
          const { data: voteRows } = await supabase
            .from("votes")
            .select("*");

          const supaMovies = movieRows ? movieRows.map(rowToMovie) : [];
          const supShowtimes = showtimeRows ? showtimeRows.map(rowToShowtime) : [];
          const supVotes: Record<string, number> = {};
          if (voteRows) {
            for (const v of voteRows) {
              supVotes[v.movie_id as string] = v.count as number;
            }
          }

          // If Supabase has data, use it as source of truth
          if (supaMovies.length > 0 || supShowtimes.length > 0) {
            set({
              movies: supaMovies.length > 0 ? supaMovies : get().movies,
              showtimes: supShowtimes.length > 0 ? supShowtimes : get().showtimes,
              votes: Object.keys(supVotes).length > 0 ? supVotes : get().votes,
              _supabaseReady: true,
            });
          } else {
            // Supabase is empty — seed from localStorage data
            const localMovies = get().movies;
            const localShowtimes = get().showtimes;
            const localVotes = get().votes;

            if (localMovies.length > 0) {
              await supabase.from("movies").upsert(localMovies.map(movieToRow));
            }
            if (localShowtimes.length > 0) {
              await supabase.from("showtimes").upsert(localShowtimes.map(showtimeToRow));
            }
            if (Object.keys(localVotes).length > 0) {
              const voteUpserts = Object.entries(localVotes).map(([movieId, count]) => ({
                movie_id: movieId,
                count,
              }));
              await supabase.from("votes").upsert(voteUpserts);
            }
            set({ _supabaseReady: true });
          }
        } catch {
          // Supabase unavailable — fall back to localStorage
          set({ _supabaseReady: true });
        }
      },

      // ── Realtime subscriptions ──

      subscribeToRealtime: () => {
        if (!isSupabaseConfigured() || !supabase) return () => {};

        const channels: RealtimeChannel[] = [];

        // Movies channel
        const moviesChannel = supabase
          .channel("movies-realtime")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "movies" },
            (payload) => {
              const state = get();
              if (payload.eventType === "INSERT") {
                const movie = rowToMovie(payload.new);
                if (!state.movies.find((m) => m.id === movie.id)) {
                  set({ movies: [movie, ...state.movies] });
                }
              } else if (payload.eventType === "UPDATE") {
                const movie = rowToMovie(payload.new);
                set({
                  movies: state.movies.map((m) =>
                    m.id === movie.id ? movie : m
                  ),
                });
              } else if (payload.eventType === "DELETE") {
                const oldId = (payload.old as { id: string }).id;
                set({
                  movies: state.movies.filter((m) => m.id !== oldId),
                });
              }
            }
          )
          .subscribe();
        channels.push(moviesChannel);

        // Showtimes channel
        const showtimesChannel = supabase
          .channel("showtimes-realtime")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "showtimes" },
            (payload) => {
              const state = get();
              if (payload.eventType === "INSERT") {
                const st = rowToShowtime(payload.new);
                if (!state.showtimes.find((s) => s.id === st.id)) {
                  set({ showtimes: [...state.showtimes, st] });
                }
              } else if (payload.eventType === "UPDATE") {
                const st = rowToShowtime(payload.new);
                set({
                  showtimes: state.showtimes.map((s) =>
                    s.id === st.id ? st : s
                  ),
                });
              } else if (payload.eventType === "DELETE") {
                const oldId = (payload.old as { id: string }).id;
                set({
                  showtimes: state.showtimes.filter((s) => s.id !== oldId),
                });
              }
            }
          )
          .subscribe();
        channels.push(showtimesChannel);

        // Votes channel
        const votesChannel = supabase
          .channel("votes-realtime")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "votes" },
            (payload) => {
              if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
                const movieId = payload.new.movie_id as string;
                const count = payload.new.count as number;
                set((state) => ({
                  votes: { ...state.votes, [movieId]: count },
                }));
              }
            }
          )
          .subscribe();
        channels.push(votesChannel);

        // Return cleanup function
        return () => {
          for (const ch of channels) {
            supabase!.removeChannel(ch);
          }
        };
      },
    }),
    {
      name: "cambo-cinema-store",
      partialize: (state) => ({
        movies: state.movies,
        showtimes: state.showtimes,
        votes: state.votes,
        userVotes: state.userVotes,
        purchasedTickets: state.purchasedTickets,
        lastLegendSync: state.lastLegendSync,
        _persistedAt: Date.now(),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Check localStorage TTL — if older than 24 hours, clear stale data
          const persistedAt = (state as Record<string, unknown>)._persistedAt as number | undefined;
          const TTL = 24 * 60 * 60 * 1000; // 24 hours
          if (persistedAt && Date.now() - persistedAt > TTL) {
            // Stale data — reset to empty so initializeFromSupabase re-fetches
            state.movies = [];
            state.showtimes = [];
            state.votes = {};
          }
          state._setHydrated(true);
        }
      },
    }
  )
);

// Lookup helpers (not stored, derived)
export function getStoreMovieById(
  movies: Movie[],
  id: string
): Movie | undefined {
  return movies.find((m) => m.id === id);
}

export function getStoreMovieBySlug(
  movies: Movie[],
  slug: string
): Movie | undefined {
  return movies.find((m) => m.slug === slug);
}

export function getStoreShowtimesForMovie(
  showtimes: Showtime[],
  movieId: string
): Showtime[] {
  return showtimes.filter((s) => s.movieId === movieId);
}

// Auto-sync hook — call once in root layout
const SYNC_INTERVAL = 30 * 60 * 1000; // 30 minutes

export function useCinemaSync() {
  const didRun = useRef(false);
  const hasHydrated = useCinemaStore((s) => s._hasHydrated);
  const initializeFromSupabase = useCinemaStore((s) => s.initializeFromSupabase);
  const subscribeToRealtime = useCinemaStore((s) => s.subscribeToRealtime);

  useEffect(() => {
    if (!hasHydrated || didRun.current) return;
    didRun.current = true;

    // Initialize from Supabase (if configured)
    initializeFromSupabase();

    // Subscribe to realtime updates
    const unsubscribe = subscribeToRealtime();

    return unsubscribe;
  }, [hasHydrated, initializeFromSupabase, subscribeToRealtime]);
}
