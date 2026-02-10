"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { movies as initialMovies, type Movie } from "@/lib/mock-data";

export default function AdminMoviesPage() {
  const [movieList, setMovieList] = useState<Movie[]>(initialMovies);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Movie | null>(null);
  const [form, setForm] = useState({
    title: "",
    titleKh: "",
    duration: "",
    genre: "",
    rating: "PG",
    subtitleLang: "ខ្មែរ",
    synopsis: "",
    status: "now_showing" as Movie["status"],
  });

  const resetForm = () => {
    setForm({ title: "", titleKh: "", duration: "", genre: "", rating: "PG", subtitleLang: "ខ្មែរ", synopsis: "", status: "now_showing" });
    setEditing(null);
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
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (editing) {
      setMovieList((prev) =>
        prev.map((m) =>
          m.id === editing.id
            ? {
                ...m,
                title: form.title,
                titleKh: form.titleKh,
                duration: parseInt(form.duration) || m.duration,
                genre: form.genre.split(",").map((g) => g.trim()),
                rating: form.rating,
                subtitleLang: form.subtitleLang,
                synopsis: form.synopsis,
                status: form.status,
              }
            : m
        )
      );
    } else {
      const newMovie: Movie = {
        id: String(Date.now()),
        slug: form.title.toLowerCase().replace(/\s+/g, "-"),
        title: form.title,
        titleKh: form.titleKh,
        posterUrl: `https://picsum.photos/seed/${Date.now()}/400/600`,
        backdropUrl: `https://picsum.photos/seed/${Date.now()}bg/1200/500`,
        trailerUrl: "",
        duration: parseInt(form.duration) || 120,
        genre: form.genre.split(",").map((g) => g.trim()),
        rating: form.rating,
        subtitleLang: form.subtitleLang,
        synopsis: form.synopsis,
        synopsisKh: "",
        releaseDate: new Date().toISOString().split("T")[0],
        status: form.status,
      };
      setMovieList((prev) => [newMovie, ...prev]);
    }
    setShowForm(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setMovieList((prev) => prev.filter((m) => m.id !== id));
  };

  const statusColors: Record<string, string> = {
    now_showing: "bg-success/10 text-success",
    coming_soon: "bg-warning/10 text-warning",
    hidden: "bg-warm-dark/10 text-warm-muted",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-warm-black">
          Movies
        </h1>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-gold hover:bg-gold-light text-warm-black font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Movie
        </Button>
      </div>

      {/* Movie list */}
      <div className="bg-cream-light border border-warm-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-border bg-cream-dark/50">
                <th className="text-left py-3 px-4 text-xs text-warm-muted font-medium">Movie</th>
                <th className="text-left py-3 px-4 text-xs text-warm-muted font-medium hidden sm:table-cell">Duration</th>
                <th className="text-left py-3 px-4 text-xs text-warm-muted font-medium hidden md:table-cell">Genre</th>
                <th className="text-left py-3 px-4 text-xs text-warm-muted font-medium">Status</th>
                <th className="text-right py-3 px-4 text-xs text-warm-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movieList.map((movie) => (
                <tr key={movie.id} className="border-b border-warm-border/50 hover:bg-cream-dark/30 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded-md overflow-hidden shrink-0 bg-cream-dark">
                        <Image
                          src={movie.posterUrl}
                          alt={movie.title}
                          width={40}
                          height={56}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-warm-black">{movie.title}</div>
                        <div className="font-[family-name:var(--font-khmer)] text-[11px] text-warm-muted">{movie.titleKh}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-[family-name:var(--font-mono)] text-xs text-warm-muted hidden sm:table-cell">
                    {movie.duration} min
                  </td>
                  <td className="py-3 px-4 text-xs text-warm-muted hidden md:table-cell">
                    {movie.genre.join(", ")}
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={`text-[10px] border-0 ${statusColors[movie.status]}`}>
                      {movie.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(movie)}
                        className="p-1.5 rounded-lg hover:bg-cream-dark transition text-warm-muted hover:text-gold"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(movie.id)}
                        className="p-1.5 rounded-lg hover:bg-error/10 transition text-warm-muted hover:text-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
              className="fixed inset-x-4 top-[10%] max-w-lg mx-auto bg-cream-light border border-warm-border rounded-2xl p-6 z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-warm-black">
                  {editing ? "Edit Movie" : "Add New Movie"}
                </h2>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="p-1 hover:bg-cream-dark rounded-lg">
                  <X className="w-5 h-5 text-warm-muted" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-warm-muted">Title (English)</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="mt-1 bg-cream border-warm-border"
                  />
                </div>
                <div>
                  <Label className="text-xs text-warm-muted">Title (Khmer)</Label>
                  <Input
                    value={form.titleKh}
                    onChange={(e) => setForm({ ...form, titleKh: e.target.value })}
                    className="mt-1 bg-cream border-warm-border font-[family-name:var(--font-khmer)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-warm-muted">Duration (min)</Label>
                    <Input
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="mt-1 bg-cream border-warm-border font-[family-name:var(--font-mono)]"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-warm-muted">Rating</Label>
                    <select
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: e.target.value })}
                      className="mt-1 w-full h-9 px-3 bg-cream border border-warm-border rounded-md text-sm"
                    >
                      <option>PG</option>
                      <option>15</option>
                      <option>18+</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-warm-muted">Genre (comma separated)</Label>
                  <Input
                    value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value })}
                    placeholder="Action, Drama"
                    className="mt-1 bg-cream border-warm-border"
                  />
                </div>
                <div>
                  <Label className="text-xs text-warm-muted">Synopsis</Label>
                  <textarea
                    value={form.synopsis}
                    onChange={(e) => setForm({ ...form, synopsis: e.target.value })}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 bg-cream border border-warm-border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div>
                  <Label className="text-xs text-warm-muted">Status</Label>
                  <div className="flex gap-2 mt-2">
                    {(["now_showing", "coming_soon", "hidden"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setForm({ ...form, status: s })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                          form.status === s
                            ? "bg-gold/20 border-gold text-gold-dark"
                            : "border-warm-border text-warm-muted hover:border-gold/50"
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
                    className="flex-1 border-warm-border"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!form.title.trim()}
                    className="flex-1 bg-gold hover:bg-gold-light text-warm-black font-semibold disabled:opacity-40"
                  >
                    {editing ? "Save Changes" : "Add Movie"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
