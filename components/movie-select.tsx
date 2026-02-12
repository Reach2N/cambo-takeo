"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import type { Movie } from "@/lib/mock-data";

interface MovieSelectProps {
  movies: Movie[];
  value: string;
  onChange: (movieId: string) => void;
  label?: string;
}

export function MovieSelect({ movies, value, onChange, label }: MovieSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = movies.find((m) => m.id === value);

  const filtered = movies.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return m.title.toLowerCase().includes(q) || m.titleKh.includes(q);
  });

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-left flex items-center justify-between gap-2 hover:border-primary/50 transition-colors"
      >
        <span className="truncate">
          {selected ? selected.title : "Select a movie..."}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies..."
                className="w-full h-8 pl-8 pr-3 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted-foreground">
                No movies found
              </div>
            ) : (
              filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onChange(m.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-secondary transition-colors ${
                    m.id === value ? "bg-primary/10" : ""
                  }`}
                >
                  <span className="flex-1 truncate">{m.title}</span>
                  {m.titleKh && (
                    <span className="text-[10px] text-muted-foreground font-[family-name:var(--font-khmer)] truncate max-w-[120px]">
                      {m.titleKh}
                    </span>
                  )}
                  {m.id === value && (
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
