"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Calendar,
  Ticket,
  DollarSign,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/movies", icon: Film, label: "Movies" },
  { href: "/admin/showtimes", icon: Calendar, label: "Showtimes" },
  { href: "/admin/bookings", icon: Ticket, label: "Bookings" },
  { href: "/admin/revenue", icon: DollarSign, label: "Revenue" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-warm-dark">
        <Link href="/" className="flex items-center gap-2">
          <Film className="w-6 h-6 text-gold" />
          <div className="leading-tight">
            <span className="font-[family-name:var(--font-display)] text-sm font-bold text-cream">
              Cambo Cinema
            </span>
            <span className="text-[9px] text-warm-tertiary block">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              isActive(item.href)
                ? "bg-gold/20 text-gold font-medium"
                : "text-warm-tertiary hover:bg-warm-dark hover:text-cream"
            }`}
          >
            <item.icon className="w-4.5 h-4.5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Back to site */}
      <div className="p-3 border-t border-warm-dark">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-warm-tertiary hover:text-gold transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to Site
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-warm-black text-cream rounded-lg shadow-lg"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-warm-black min-h-screen shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-56 bg-warm-black z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
