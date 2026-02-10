"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-warm-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Film className="w-7 h-7 text-gold" />
          <div className="leading-tight">
            <span className="font-[family-name:var(--font-display)] text-lg font-bold text-warm-black tracking-tight">
              Cambo Cinema
            </span>
            <span className="text-[10px] text-warm-muted block -mt-1 font-medium">TAKEO</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-warm-dark hover:text-gold transition-colors">
            Home
          </Link>
          <Link href="/#now-showing" className="text-sm font-medium text-warm-dark hover:text-gold transition-colors">
            Now Showing
          </Link>
          <Link href="/#coming-soon" className="text-sm font-medium text-warm-dark hover:text-gold transition-colors">
            Coming Soon
          </Link>
          <Link href="/admin" className="text-sm font-medium text-warm-muted hover:text-gold transition-colors">
            Admin
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg hover:bg-cream-dark transition-colors"
          >
            <Search className="w-5 h-5 text-warm-dark" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-cream-dark transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-warm-border"
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              <input
                type="text"
                placeholder="Search movies..."
                autoFocus
                className="w-full px-4 py-2 bg-cream-light border border-warm-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-b border-warm-border bg-cream"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-warm-dark hover:text-gold py-2"
              >
                Home
              </Link>
              <Link
                href="/#now-showing"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-warm-dark hover:text-gold py-2"
              >
                Now Showing
              </Link>
              <Link
                href="/#coming-soon"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-warm-dark hover:text-gold py-2"
              >
                Coming Soon
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-warm-muted hover:text-gold py-2"
              >
                Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
