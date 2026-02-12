"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, X, Film, Search, Loader2, Download,
  ExternalLink, Play, Star, RefreshCw, ChevronLeft, ChevronRight,
  Check, ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { type Movie } from "@/lib/mock-data";
import { useCinemaStore } from "@/lib/cinema-store";
import { extractYouTubeId } from "@/lib/legend";
import { getYouTubeThumbnail } from "@/lib/tmdb";
import { useI18n } from "@/lib/i18n";

interface TMDBSearchResult {
  tmdbId: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  genres: string[];
  popularity: number;
}

interface LegendImportMovie {
  id: string;
  slug: string;
  title: string;
  titleKh: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  duration: number;
  genre: string[];
  rating: string;
  subtitleLang: string;
  synopsis: string;
  synopsisKh: string;
  releaseDate: string;
  status: string;
  source: string;
  hasSession?: boolean;
}

// Broken image placeholder
function MoviePoster({ src, alt, width, height, className }: {
  src: string; alt: string; width: number; height: number; className?: string;
}) {
  const [error, setError] = useState(false);
  const { t } = useI18n();
  if (error || !src) {
    return (
      <div className={`bg-secondary flex flex-col items-center justify-center gap-0.5 ${className}`} style={{ width, height }}>
        <Film className="w-4 h-4 text-muted-foreground/40" />
        <span className="text-[6px] text-muted-foreground/50 text-center px-0.5 leading-tight">{t("common.noPoster")}</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  );
}

export default function AdminMoviesPage() {
  const {
    movies: movieList,
    addMovie,
    addMovies,
    updateMovie: storeUpdateMovie,
    deleteMovie: storeDeleteMovie,
  } = useCinemaStore();

  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // TMDB Search states
  const [tmdbQuery, setTmdbQuery] = useState("");
  const [tmdbResults, setTmdbResults] = useState<TMDBSearchResult[]>([]);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [showTmdbSearch, setShowTmdbSearch] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState<number | null>(null);

  // Legend Import Modal states
  const [showLegendModal, setShowLegendModal] = useState(false);
  const [legendMovies, setLegendMovies] = useState<LegendImportMovie[]>([]);
  const [legendLoading, setLegendLoading] = useState(false);
  const [legendSelected, setLegendSelected] = useState<Set<string>>(new Set());
  const [legendSearch, setLegendSearch] = useState("");
  const [legendImporting, setLegendImporting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    titleKh: "",
    duration: "",
    genre: "",
    rating: "PG",
    subtitleLang: "ខ្មែរ",
    synopsis: "",
    status: "coming_soon" as Movie["status"],
    posterUrl: "",
    backdropUrl: "",
    trailerUrl: "",
  });

  // YouTube trailer preview
  const trailerYouTubeId = form.trailerUrl ? extractYouTubeId(form.trailerUrl) : null;
  const trailerThumbnail = trailerYouTubeId
    ? getYouTubeThumbnail(trailerYouTubeId).replace("hqdefault", "maxresdefault")
    : null;

  // Filter movies by search
  const filteredMovies = (() => {
    if (!searchQuery.trim()) return movieList;
    const q = searchQuery.toLowerCase();
    return movieList.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.titleKh.includes(q) ||
        m.genre.some((g) => g.toLowerCase().includes(q))
    );
  })();

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const paginatedMovies = filteredMovies.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const resetForm = () => {
    setForm({
      title: "", titleKh: "", duration: "", genre: "", rating: "PG",
      subtitleLang: "ខ្មែរ", synopsis: "", status: "coming_soon",
      posterUrl: "", backdropUrl: "", trailerUrl: "",
    });
    setEditing(null);
    setTmdbResults([]);
    setTmdbQuery("");
    setShowTmdbSearch(false);
  };

  const openEdit = (movie: Movie) => {
    setEditing(movie);
    setForm({
      title: movie.title,
      titleKh: movie.titleKh,
      duration: String(movie.duration),
      genre: movie.genre.join(", "),
      rating: movie.rating,
      subtitleLang: movie.subtitleLang,
      synopsis: movie.synopsis,
      status: movie.status,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      trailerUrl: movie.trailerUrl,
    });
    setShowForm(true);
  };

  // TMDB Search
  const searchTMDB = useCallback(async () => {
    if (!tmdbQuery.trim()) return;
    setTmdbLoading(true);
    try {
      const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(tmdbQuery)}`);
      const data = await res.json();
      setTmdbResults(data.results || []);
    } catch {
      setTmdbResults([]);
    }
    setTmdbLoading(false);
  }, [tmdbQuery]);

  // Auto-fill from TMDB result (fetches full detail with trailer)
  const fillFromTMDB = async (result: TMDBSearchResult) => {
    setLoadingDetail(result.tmdbId);
    try {
      const res = await fetch(`/api/tmdb/detail?id=${result.tmdbId}`);
      const data = await res.json();
      if (data.movie) {
        const m = data.movie;
        setForm({
          title: m.title,
          titleKh: "",
          duration: String(m.duration || 0),
          genre: m.genre?.join(", ") || result.genres.join(", "),
          rating: m.rating || "PG",
          subtitleLang: "ខ្មែរ",
          synopsis: m.synopsis || result.overview,
          status: "coming_soon",
          posterUrl: m.posterUrl || result.posterUrl,
          backdropUrl: m.backdropUrl || result.backdropUrl,
          trailerUrl: m.trailerUrl || "",
        });
      } else {
        // Fallback to search result data
        setForm({
          ...form,
          title: result.title,
          synopsis: result.overview,
          genre: result.genres.join(", "),
          posterUrl: result.posterUrl,
          backdropUrl: result.backdropUrl,
        });
      }
    } catch {
      setForm({
        ...form,
        title: result.title,
        synopsis: result.overview,
        genre: result.genres.join(", "),
        posterUrl: result.posterUrl,
        backdropUrl: result.backdropUrl,
      });
    }
    setLoadingDetail(null);
    setShowTmdbSearch(false);
  };

  // Legend Import Modal
  const openLegendModal = async () => {
    setShowLegendModal(true);
    setLegendLoading(true);
    setLegendSelected(new Set());
    try {
      const res = await fetch("/api/legend");
      const data = await res.json();
      if (data.movies && data.movies.length > 0) {
        setLegendMovies(data.movies);
      } else {
        setLegendMovies([]);
      }
    } catch {
      setLegendMovies([]);
    }
    setLegendLoading(false);
  };

  const existingTitles = new Set(movieList.map((m) => m.title.toLowerCase()));

  const filteredLegendMovies = legendMovies.filter((m) => {
    if (!legendSearch.trim()) return true;
    const q = legendSearch.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      (m.genre && m.genre.some((g) => g.toLowerCase().includes(q))) ||
      (m.releaseDate && m.releaseDate.includes(q))
    );
  });

  const toggleLegendSelect = (id: string) => {
    setLegendSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAllLegend = () => {
    const selectable = filteredLegendMovies.filter(
      (m) => !existingTitles.has(m.title.toLowerCase())
    );
    setLegendSelected(new Set(selectable.map((m) => m.id)));
  };

  const deselectAllLegend = () => {
    setLegendSelected(new Set());
  };

  const importSelectedLegend = () => {
    setLegendImporting(true);
    const toImport = legendMovies.filter((m) => legendSelected.has(m.id));
    const newMovies: Movie[] = toImport.map((m) => {
      const status = m.hasSession ? "now_showing" : "coming_soon";
      return {
        id: m.id || String(Date.now() + Math.random()),
        slug: m.slug || m.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        title: m.title,
        titleKh: m.titleKh || "",
        posterUrl: m.posterUrl || "",
        backdropUrl: m.backdropUrl || "",
        trailerUrl: m.trailerUrl || "",
        duration: m.duration || 0,
        genre: m.genre || [],
        rating: m.rating || "PG",
        subtitleLang: m.subtitleLang || "ខ្មែរ",
        synopsis: m.synopsis || "",
        synopsisKh: m.synopsisKh || "",
        releaseDate: m.releaseDate || new Date().toISOString().split("T")[0],
        status: status as Movie["status"],
        source: "legend",
      };
    });
    // Batch add all at once to avoid flickering from multiple re-renders
    addMovies(newMovies);
    setLegendImporting(false);
    setShowLegendModal(false);
  };

  const handleSave = () => {
    if (editing) {
      storeUpdateMovie(editing.id, {
        title: form.title,
        titleKh: form.titleKh,
        duration: parseInt(form.duration) || editing.duration,
        genre: form.genre.split(",").map((g) => g.trim()),
        rating: form.rating,
        subtitleLang: form.subtitleLang,
        synopsis: form.synopsis,
        status: form.status,
        posterUrl: form.posterUrl || editing.posterUrl,
        backdropUrl: form.backdropUrl || editing.backdropUrl,
        trailerUrl: form.trailerUrl || editing.trailerUrl,
      });
    } else {
      const newMovie: Movie = {
        id: String(Date.now()),
        slug: form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        title: form.title,
        titleKh: form.titleKh,
        posterUrl: form.posterUrl || `https://picsum.photos/seed/${Date.now()}/400/600`,
        backdropUrl: form.backdropUrl || `https://picsum.photos/seed/${Date.now()}bg/1200/500`,
        trailerUrl: form.trailerUrl,
        duration: parseInt(form.duration) || 120,
        genre: form.genre.split(",").map((g) => g.trim()),
        rating: form.rating,
        subtitleLang: form.subtitleLang,
        synopsis: form.synopsis,
        synopsisKh: "",
        releaseDate: new Date().toISOString().split("T")[0],
        status: form.status,
        source: "manual",
      };
      addMovie(newMovie);
    }
    setShowForm(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    storeDeleteMovie(id);
  };

  const statusColors: Record<string, string> = {
    now_showing: "bg-success/10 text-success",
    coming_soon: "bg-warning/10 text-warning",
    hidden: "bg-muted-foreground/10 text-muted-foreground",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          {t("admin.movies")}
        </h1>
        <div className="flex items-center gap-2">
          {/* Legend Import */}
          <Button
            variant="outline"
            onClick={() => openLegendModal()}
            className="border-border text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("admin.autoAdd")}
          </Button>

          <Button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary hover:bg-primary/90 text-foreground font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("admin.addMovie")}
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("admin.searchMovies")}
          className="pl-9 bg-background border-border"
        />
      </div>

      {/* Movie list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">{t("admin.movie")}</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden sm:table-cell">{t("admin.duration")}</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden md:table-cell">{t("admin.genre")}</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium hidden lg:table-cell">{t("hero.trailer")}</th>
                <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">{t("admin.status")}</th>
                <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMovies.map((movie) => (
                <tr key={movie.id} className="border-b border-border/50 hover:bg-secondary/30 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded-md overflow-hidden shrink-0 bg-secondary">
                        <MoviePoster
                          src={movie.posterUrl}
                          alt={movie.title}
                          width={40}
                          height={56}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{movie.title}</div>
                        {movie.titleKh && (
                          <div className="font-[family-name:var(--font-khmer)] text-[11px] text-muted-foreground">{movie.titleKh}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-[family-name:var(--font-mono)] text-xs text-muted-foreground hidden sm:table-cell">
                    {movie.duration > 0 ? `${movie.duration} min` : "—"}
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground hidden md:table-cell">
                    {movie.genre.join(", ")}
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    {movie.trailerUrl ? (
                      <a
                        href={movie.trailerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        {t("admin.watch")}
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={`text-[10px] border-0 ${statusColors[movie.status]}`}>
                      {movie.status === "now_showing" ? t("admin.nowShowingStatus") : movie.status === "coming_soon" ? t("admin.comingSoonStatus") : t("admin.hidden")}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(movie)}
                        className="p-1.5 rounded-lg hover:bg-secondary transition text-muted-foreground hover:text-primary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedMovies.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    {t("admin.noMovies")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        {movieList.length} {t("admin.totalMovies")} · {filteredMovies.length} {t("admin.showing")} · {t("common.page")} {page} {t("common.of")} {totalPages || 1}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="border-border text-xs"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t("common.previous")}
          </Button>
          <span className="text-xs text-muted-foreground font-[family-name:var(--font-mono)]">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="border-border text-xs"
          >
            {t("common.next")}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Add/Edit form modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowForm(false); resetForm(); }}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-[5%] max-w-xl mx-auto bg-card border border-border rounded-2xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
                  {editing ? t("admin.editMovie") : t("admin.addNewMovie")}
                </h2>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="p-1 hover:bg-secondary rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* TMDB Auto-fill search */}
              {!editing && (
                <div className="mb-5 p-3 bg-secondary/50 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-primary">{t("admin.tmdbAutoFill")}</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        value={tmdbQuery}
                        onChange={(e) => setTmdbQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && searchTMDB()}
                        placeholder={t("common.search")}
                        className="pl-8 h-8 text-xs bg-background border-border"
                      />
                    </div>
                    <Button
                      onClick={searchTMDB}
                      disabled={tmdbLoading}
                      size="sm"
                      className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                    >
                      {tmdbLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : t("common.search")}
                    </Button>
                  </div>

                  {/* TMDB Results */}
                  {tmdbResults.length > 0 && (
                    <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                      {tmdbResults.map((r) => (
                        <button
                          key={r.tmdbId}
                          onClick={() => fillFromTMDB(r)}
                          disabled={loadingDetail === r.tmdbId}
                          className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-background transition text-left"
                        >
                          <div className="w-8 h-12 rounded shrink-0 overflow-hidden bg-muted">
                            {r.posterUrl && (
                              <MoviePoster
                                src={r.posterUrl}
                                alt={r.title}
                                width={32}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-foreground truncate">{r.title}</div>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span>{r.releaseDate?.slice(0, 4) || "N/A"}</span>
                              <span className="flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                                {r.voteAverage.toFixed(1)}
                              </span>
                              <span>{r.genres.slice(0, 2).join(", ")}</span>
                            </div>
                          </div>
                          {loadingDetail === r.tmdbId ? (
                            <Loader2 className="w-3 h-3 animate-spin text-primary shrink-0" />
                          ) : (
                            <Download className="w-3 h-3 text-muted-foreground shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {/* Preview poster + backdrop */}
                {(form.posterUrl || form.backdropUrl) && (
                  <div className="flex gap-3">
                    {form.posterUrl && (
                      <div className="w-16 h-24 rounded-lg overflow-hidden border border-border shrink-0">
                        <MoviePoster src={form.posterUrl} alt="Poster" width={64} height={96} className="object-cover w-full h-full" />
                      </div>
                    )}
                    {form.backdropUrl && (
                      <div className="flex-1 h-24 rounded-lg overflow-hidden border border-border">
                        <MoviePoster src={form.backdropUrl} alt="Backdrop" width={320} height={96} className="object-cover w-full h-full" />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <Label className="text-xs text-muted-foreground">{t("admin.titleEn")}</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="mt-1 bg-background border-border"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t("admin.titleKh")}</Label>
                  <Input
                    value={form.titleKh}
                    onChange={(e) => setForm({ ...form, titleKh: e.target.value })}
                    className="mt-1 bg-background border-border font-[family-name:var(--font-khmer)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("admin.durationMin")}</Label>
                    <Input
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="mt-1 bg-background border-border font-[family-name:var(--font-mono)]"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("admin.rating")}</Label>
                    <select
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: e.target.value })}
                      className="mt-1 w-full h-9 px-3 bg-background border border-border rounded-md text-sm"
                    >
                      <option>G</option>
                      <option>PG</option>
                      <option>NC15</option>
                      <option>15</option>
                      <option>R18</option>
                      <option>18+</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("admin.genreComma")}</Label>
                    <Input
                      value={form.genre}
                      onChange={(e) => setForm({ ...form, genre: e.target.value })}
                      placeholder="Action, Drama"
                      className="mt-1 bg-background border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("admin.subtitleLang")}</Label>
                    <select
                      value={form.subtitleLang}
                      onChange={(e) => setForm({ ...form, subtitleLang: e.target.value })}
                      className="mt-1 w-full h-9 px-3 bg-background border border-border rounded-md text-sm"
                    >
                      <option value="ខ្មែរ">ខ្មែរ (Khmer)</option>
                      <option value="EN">English</option>
                      <option value="中文">中文 (Chinese)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t("admin.trailerUrl")}</Label>
                  <Input
                    value={form.trailerUrl}
                    onChange={(e) => setForm({ ...form, trailerUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="mt-1 bg-background border-border text-xs"
                  />
                  {/* YouTube thumbnail preview */}
                  {trailerThumbnail && (
                    <div className="mt-2">
                      <div className="relative h-32 rounded-lg overflow-hidden border border-border">
                        <MoviePoster src={trailerThumbnail} alt="Trailer thumbnail" width={320} height={180} className="object-cover w-full h-full" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-8 h-8 text-white fill-white/80" />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setForm({ ...form, backdropUrl: trailerThumbnail })}
                        className="mt-2 text-xs border-border"
                      >
                        <ImageIcon className="w-3 h-3 mr-1.5" />
                        {t("admin.useAsBackdrop")}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("admin.posterUrl")}</Label>
                    <Input
                      value={form.posterUrl}
                      onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
                      placeholder="https://..."
                      className="mt-1 bg-background border-border text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t("admin.backdropUrl")}</Label>
                    <Input
                      value={form.backdropUrl}
                      onChange={(e) => setForm({ ...form, backdropUrl: e.target.value })}
                      placeholder="https://..."
                      className="mt-1 bg-background border-border text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t("movie.synopsis")}</Label>
                  <textarea
                    value={form.synopsis}
                    onChange={(e) => setForm({ ...form, synopsis: e.target.value })}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t("admin.status")}</Label>
                  <div className="flex gap-2 mt-2">
                    {(["now_showing", "coming_soon", "hidden"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setForm({ ...form, status: s })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                          form.status === s
                            ? "bg-primary/20 border-primary text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {s.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => { setShowForm(false); resetForm(); }}
                    className="flex-1 border-border"
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!form.title.trim()}
                    className="flex-1 bg-primary hover:bg-primary/90 text-foreground font-semibold disabled:opacity-40"
                  >
                    {editing ? t("admin.saveChanges") : t("admin.addMovie")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Legend Import Modal */}
      <AnimatePresence>
        {showLegendModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLegendModal(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-[5%] max-w-2xl mx-auto bg-card border border-border rounded-2xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
                  Import from Legend Cinema
                </h2>
                <button onClick={() => setShowLegendModal(false)} className="p-1 hover:bg-secondary rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {legendLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">Fetching movies from Legend...</span>
                </div>
              ) : legendMovies.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  No movies available from Legend Cinema API.
                </div>
              ) : (
                <>
                  {/* Search filter */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={legendSearch}
                      onChange={(e) => setLegendSearch(e.target.value)}
                      placeholder="Search by title, genre, date..."
                      className="pl-9 bg-background border-border text-xs"
                    />
                  </div>

                  {/* Select all / deselect */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground">
                      {filteredLegendMovies.length} movies · {legendSelected.size} selected
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={selectAllLegend} className="text-xs border-border h-7">
                        Select All
                      </Button>
                      <Button variant="outline" size="sm" onClick={deselectAllLegend} className="text-xs border-border h-7">
                        Deselect
                      </Button>
                    </div>
                  </div>

                  {/* Movie list */}
                  <div className="space-y-1.5 max-h-[50vh] overflow-y-auto">
                    {filteredLegendMovies.map((m) => {
                      const alreadyAdded = existingTitles.has(m.title.toLowerCase());
                      const isSelected = legendSelected.has(m.id);
                      return (
                        <button
                          key={m.id}
                          onClick={() => !alreadyAdded && toggleLegendSelect(m.id)}
                          disabled={alreadyAdded}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition border ${
                            alreadyAdded
                              ? "opacity-50 cursor-not-allowed border-border/50 bg-secondary/30"
                              : isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 hover:bg-secondary/30"
                          }`}
                        >
                          {/* Checkbox */}
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition ${
                            alreadyAdded
                              ? "border-muted-foreground/30"
                              : isSelected
                              ? "border-primary bg-primary"
                              : "border-border"
                          }`}>
                            {(isSelected || alreadyAdded) && (
                              <Check className={`w-3 h-3 ${alreadyAdded ? "text-muted-foreground/50" : "text-primary-foreground"}`} />
                            )}
                          </div>

                          {/* Poster */}
                          <div className="w-8 h-12 rounded shrink-0 overflow-hidden bg-muted">
                            {m.posterUrl && (
                              <MoviePoster src={m.posterUrl} alt={m.title} width={32} height={48} className="object-cover w-full h-full" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-foreground truncate">{m.title}</div>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                              {m.releaseDate && <span>{m.releaseDate.slice(0, 10)}</span>}
                              {m.duration > 0 && <span>{m.duration} min</span>}
                            </div>
                          </div>

                          {/* Status */}
                          {alreadyAdded ? (
                            <Badge className="text-[10px] border-0 bg-muted-foreground/10 text-muted-foreground shrink-0">
                              Already added
                            </Badge>
                          ) : (
                            <Badge className={`text-[10px] border-0 shrink-0 ${
                              m.hasSession
                                ? "bg-success/10 text-success"
                                : "bg-warning/10 text-warning"
                            }`}>
                              {m.hasSession ? "now showing" : "coming soon"}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Import button */}
                  <div className="flex gap-3 mt-5 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => setShowLegendModal(false)}
                      className="flex-1 border-border"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={importSelectedLegend}
                      disabled={legendSelected.size === 0 || legendImporting}
                      className="flex-1 bg-primary hover:bg-primary/90 text-foreground font-semibold disabled:opacity-40"
                    >
                      {legendImporting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Import {legendSelected.size} Movie{legendSelected.size !== 1 ? "s" : ""}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
